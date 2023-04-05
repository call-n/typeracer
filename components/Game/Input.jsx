import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { BsFlagFill } from "react-icons/bs";
import useTyping from "react-typing-game-hook";
import {
  Box,
  Text,
  Flex,
  Input,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from "@chakra-ui/react";

import { usePreferenceContext } from "../../contexts/Prefrence/PreferenceContext";
import { useUserContext } from "../../contexts/UserContext";

// eslint-disable-next-line react/display-name
const TypingInput = forwardRef(({ text, time }, ref) => {
  const [duration, setDuration] = useState(() => 0);
  const [isFocused, setIsFocused] = useState(() => false);
  const letterElements = useRef(null);
  const [timeLeft, setTimeLeft] = useState(() => parseInt(time));

  const {
    preferences: { isOpen, type },
  } = usePreferenceContext();

  const { currentUser, addToLeaderboard } = useUserContext();

  const {
    states: {
      charsState,
      currIndex,
      phase,
      correctChar,
      errorChar,
      startTime,
      endTime,
    },
    actions: { insertTyping, deleteTyping, resetTyping, endTyping },
  } = useTyping(text, { skipCurrentWordOnSpace: false });

  const [margin, setMargin] = useState(() => 0);
  const [value, setValue] = useState(() => "");

  // set cursor
  const pos = useMemo(() => {
    if (currIndex !== -1 && letterElements.current) {
      const spanref = letterElements.current.children[currIndex];

      const left = spanref.offsetLeft + spanref.offsetWidth - 2;
      const top = spanref.offsetTop - 2;
      if (top > 60) {
        setMargin((margin) => margin + 1);
        return {
          left,
          top: top / 2,
        };
      }
      return { left, top };
    } else {
      return {
        left: -2,
        top: 2,
      };
    }
  }, [currIndex]);

  useEffect(() => {
    setValue("");
    setMargin(0);
    setTimeLeft(parseInt(time));
    endTyping();
    resetTyping();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, time]);

  // handle timer
  useEffect(() => {
    const timerInterval = setInterval(() => {
      if (startTime) {
        setTimeLeft((timeLeft) => {
          if (timeLeft === 1) {
            clearInterval(timerInterval);
            endTyping();
          }
          return parseInt(time) - Math.floor((Date.now() - startTime) / 1000);
        });
      }
    }, 1000);
    if (phase === 2) {
      clearInterval(timerInterval);
    }

    return () => clearInterval(timerInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime, phase]);

  //set WPM
  useEffect(() => {
    if (phase === 2 && endTime && startTime) {
      const dur = Math.floor((endTime - startTime) / 1000);
      setDuration(dur);
      // check if the user is logged in
      if (currentUser) {
        addToLeaderboard(
          currentUser.displayName,
          Math.round(((60 / dur) * correctChar) / 5),
          currentUser.uid,
          parseInt(time),
          type || "words",
          (((correctChar - errorChar) / (currIndex + 1)) * 100).toFixed(2),
          new Date().toLocaleDateString(),
          new Date().toLocaleTimeString()
        );
      }
    } else {
      setDuration(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, startTime, endTime, ref]);

  //handle key presses
  const handleKeyDown = (letter, control) => {
    if (letter === "Backspace") {
      const spanref = letterElements?.current?.children[currIndex];
      const top = spanref?.offsetTop - 2;

      if (top < 0) {
        return;
      }
      deleteTyping(control);
    } else if (letter.length === 1) {
      insertTyping(letter);
    }
  };

  return (
    <Flex position="relative" maxW="950px" width="100%" flexDirection="column">
      <Text
        pos="absolute"
        left="0"
        top="-10"
        zIndex="40"
        fontSize="2xl"
        fontWeight="600"
        color="green.300"
      >
        {timeLeft}
      </Text>

      <Box
        pos="relative"
        zIndex="40"
        height="140px"
        width="100%"
        fontSize="2xl"
        outline="0"
        onClick={() => {
          if (ref != null && typeof ref !== "function") {
            ref?.current?.focus();
          }
          setIsFocused(true);
        }}
      >
        <Input
          type="text"
          className="absolute left-0 top-0 z-20 h-full w-full cursor-default opacity-0"
          position="absolute"
          left="0"
          top="0"
          zIndex="20"
          height="100%"
          width="100%"
          cursor="default"
          opacity="0"
          tabIndex={1}
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          value={value}
          onChange={(e) => {
            setValue((prev) => {
              if (prev.length > e.target.value.length) {
                handleKeyDown("Backspace", false);
              } else {
                handleKeyDown(e.target.value.slice(-1), false);
              }
              return e.target.value;
            });
          }}
          onKeyDown={(e) => {
            if (isOpen) {
              setIsFocused(false);
              return;
            }
            if (e.ctrlKey) return;
            if (
              ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(
                e.key
              )
            )
              e.preventDefault();
          }}
        />
        <Box
          position="absolute"
          top="0"
          left="0"
          marginBottom="4"
          height="100%"
          width="100%"
          overflow="hidden"
          textAlign="justify"
        >
          <div
            ref={letterElements}
            style={
              margin > 0
                ? {
                    marginTop: -(margin * 39),
                  }
                : {
                    marginTop: 0,
                  }
            }
          >
            {text.split("").map((letter, index) => {
              const state = charsState[index];
              const color =
                state === 0
                  ? "graygame"
                  : state === 1
                  ? "greengame"
                  : "redgame";
              return (
                <span
                  key={letter + index}
                  className={`${color} ${
                    state === 0 && index < currIndex && "currentgame"
                  }`}
                >
                  {letter}
                </span>
              );
            })}
          </div>
        </Box>
        {isFocused ? (
          <span
            className="animatedcursor"
            style={{
              left: pos.top < 0 ? -2 : pos.left,
              top: pos.top < 0 ? 2 : pos.top + 2,
            }}
          >
            {phase === 2 ? (
              <Box pos="relative" zIndex="40">
                <BsFlagFill style={{ marginBottom: "4px" }} />
              </Box>
            ) : (
              "|"
            )}
          </span>
        ) : null}
        <Flex
          pos="absolute"
          right="0"
          top="-40"
          zIndex="40"
          fontSize="2xl"
          fontWeight="600"
          color="green.300"
          background="gray.700"
          rounded="2xl"
          padding="1rem"
        >
          {phase === 2 && startTime && endTime ? (
            <Stat>
              <StatLabel>Time: {duration} s</StatLabel>
              <StatNumber>
                {Math.round(((60 / duration) * correctChar) / 5)} WPM
              </StatNumber>
              <StatHelpText>
                {(((correctChar - errorChar) / (currIndex + 1)) * 100).toFixed(
                  2
                )}
                % Accuracy
              </StatHelpText>
            </Stat>
          ) : null}
        </Flex>
      </Box>
    </Flex>
  );
});

export default TypingInput;
