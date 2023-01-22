import {
  useEffect,
  createContext,
  useContext,
  useReducer,
  useState,
} from "react";
import { useRouter } from "next/router";
import { io } from "socket.io-client";

import reducer from "./reducer";
import { useUserContext } from "../UserContext";

const socket = io(
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8080",
  {
    autoConnect: false,
    transports: ["websocket"],
  }
);

const MultiplayerContext = createContext({});

export function MultiplayerProvider({ children }) {
  const { currentUser } = useUserContext();

  const [room, dispatch] = useReducer(reducer, {
    text: "",
    mode: "words",
    isPlaying: false,
    isFinished: false,
    winner: null,
    user: {
      isOwner: false,
      roomId: null,
      username: currentUser?.displayName || "guest",
      id: "",
      status: {
        wpm: 0,
        progress: 0,
      },
      isReady: false,
    },
    players: [],
    socket,
  });

  const [timeBeforeRestart, setTimeBeforeRestart] = useState(0);

  const resetTime = async (time) => setTimeBeforeRestart(time);

  useEffect(() => {
    const dispatchTimeout = setTimeout(() => {
      room.user.isReady && dispatch({ type: "SET_IS_PLAYING", payload: true });
    }, 5000);

    const restartInterval = setInterval(() => {
      if (room.user.isReady) {
        setTimeBeforeRestart((previousTime) => {
          if (previousTime === 0) {
            clearInterval(restartInterval);
          }
          return previousTime - 1;
        });
      }
    }, 1000);

    return () => {
      clearInterval(restartInterval);
      clearTimeout(dispatchTimeout);
    };
  }, [room.user.isReady]);

  const { pathname } = useRouter();

  socket.on("connect", () => {
    dispatch({ type: "SET_USER_ID", payload: socket.id });
  });

  socket.on("disconnect", () => {
    dispatch({ type: "SET_IS_READY", payload: false });
    dispatch({ type: "SET_ROOM_ID", payload: null });
  });

  useEffect(() => {
    if (room.user.id && room.user.roomId) {
      socket.emit("room update", room.user);
    }

    if (pathname === "/multiplayer" && room.user.roomId && room.user.id) {
      socket.emit("leave room", room.user);
    }

    socket.connect();
  }, [pathname, room.user]);

  return (
    <MultiplayerContext.Provider
      value={{ room, dispatch, timeBeforeRestart, resetTime }}
    >
      {children}
    </MultiplayerContext.Provider>
  );
}

export const useMultiplayerContext = () => useContext(MultiplayerContext);
