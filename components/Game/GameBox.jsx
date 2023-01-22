import { useState, useEffect, useRef } from "react";
import { VscDebugRestart } from "react-icons/vsc";

import { shuffleList } from "../../lib/shuffleList";
import Input from "./Input";

import { Button, Flex, Box } from "@chakra-ui/react";

import { usePreferenceContext } from "../../contexts/Prefrence/PreferenceContext";

export default function GameBox() {
  const _ = require("lodash");
  const inputRef = useRef();
  const buttonRef = useRef();

  const {
    preferences: { type, time, isOpen },
  } = usePreferenceContext();

  const [list, setList] = useState(() => shuffleList(type));

  useEffect(() => {
    const onKeyDown = (event) => {
      if (isOpen) return;
      if (event.key === "tab") {
        buttonRef.current.focus();
      } else if (event.key !== "Enter") {
        inputRef.current.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    setList(shuffleList(type));
  }, [type]);

  return (
    <Flex
      flexDirection="column"
      width="90%"
      justifyContent="center"
      alignItems="center"
    >
      <Input ref={inputRef} text={list.join(" ")} time={time} />

      <Box marginTop="1.5rem">
        <Button
          onClick={() => {
            inputRef.current.focus();
            setList(shuffleList(type));
          }}
          ref={buttonRef}
          tabIndex={2}
          background="green.400"
        >
          <VscDebugRestart className="scale-x-[-1] transform text-2xl" />
          Restart Test
        </Button>
      </Box>
    </Flex>
  );
}
