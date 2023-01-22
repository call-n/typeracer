import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMultiplayerContext } from "../../contexts/Multiplayer/MultiplayerContext";
import AnimatedTransition from "../../components/Layout/AnimatedTransition";
import Multiplayer from "../../components/Multiplayer/Multiplayer";
import { Flex } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";

const MultiplayerRoom = () => {
  const {
    room: { socket, user },
    dispatch,
    resetTime,
  } = useMultiplayerContext();

  const toast = useToast();

  const router = useRouter();

  useEffect(() => {
    if (user.id && router?.query?.id) {
      socket.emit("join room", { roomId: router?.query?.id, user });
      dispatch({ type: "SET_ROOM_ID", payload: router?.query?.id });

      socket.off("room update").on("room update", (players) => {
        dispatch({ type: "SET_PLAYERS", payload: players });
      });

      socket.off("start game").on("start game", () => {
        dispatch({ type: "SET_STATUS", payload: { progress: 0, wpm: 0 } });
        dispatch({ type: "SET_IS_FINISHED", payload: false });
        dispatch({ type: "SET_WINNER", payload: null });
        resetTime(5).then(() =>
          dispatch({ type: "SET_IS_READY", payload: true })
        );
      });

      dispatch({ type: "SET_STATUS", payload: { progress: 0, wpm: 0 } });
      dispatch({ type: "SET_IS_READY", payload: false });
      dispatch({ type: "SET_IS_PLAYING", payload: false });
      dispatch({ type: "SET_IS_FINISHED", payload: false });
      dispatch({ type: "SET_WINNER", payload: null });
      resetTime(0);

      socket.off("end game").on("end game", (playerId) => {
        dispatch({ type: "SET_IS_PLAYING", payload: false });
        dispatch({ type: "SET_WINNER", payload: playerId });
        dispatch({ type: "SET_IS_READY", payload: false });
      });

      socket.off("room invalid").on("room invalid", () => {
        toast({
          title: "Room doesn't exist.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        router.push("/multiplayer");
      });

      socket.off("room in game").on("room in game", () => {
        toast({
          title: "Room is currently in game.",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
        router.push("/multiplayer");
      });

      socket.off("words generated").on("words generated", (text) => {
        dispatch({ type: "SET_TEXT", payload: text });
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query, user.id]);

  return (
    <AnimatedTransition>
      <Flex minH="85vh" justifyContent="center" alignItems="center">
        <Multiplayer />
      </Flex>
    </AnimatedTransition>
  );
};

export default MultiplayerRoom;
