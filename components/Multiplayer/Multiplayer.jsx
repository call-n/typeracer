import { useRef, useEffect } from "react";
import TypingInput from "./Input";
import { usePreferenceContext } from "../../contexts/Prefrence/PreferenceContext";
import { useMultiplayerContext } from "../../contexts/Multiplayer/MultiplayerContext";

import { Box, Flex, Button } from "@chakra-ui/react";

export default function Multiplayer() {
  const inputRef = useRef();
  const buttonRef = useRef();
  const {
    preferences: { isOpen },
  } = usePreferenceContext();

  const {
    room: {
      isPlaying,
      winner,
      isChatOpen,
      socket,
      user: { id, roomId, isOwner },
    },
    timeBeforeRestart,
  } = useMultiplayerContext();

  useEffect(() => {
    isPlaying && inputRef.current.focus();
    !isPlaying && inputRef.current.blur();
  }, [isPlaying]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (isOpen || isChatOpen) return;
      if (e.key === "tab") {
        buttonRef.current.focus();
      } else if (e.key !== "Enter" && !e.ctrlKey && isPlaying) {
        inputRef.current.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, isChatOpen, isPlaying]);

  console.log(id, isOwner);

  return (
    <Flex
      flexDirection="column"
      width="90%"
      justifyContent="center"
      alignItems="center"
    >
      <TypingInput ref={inputRef} />

      <Box marginTop="1.5rem">
        <Button
          ref={buttonRef}
          disabled={isPlaying || !isOwner || timeBeforeRestart > 0}
          tabIndex={2}
          onClick={() => id && roomId && socket.emit("start game", roomId)}
          background="green.400"
        >
          {winner ? "Restart" : isPlaying ? "In Game" : "Start"}
        </Button>
      </Box>
    </Flex>
  );
}
