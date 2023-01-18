import { useEffect, useMemo, useRef, useState, forwardRef } from 'react';
import useTyping from 'react-typing-game-hook';

import { usePreferenceContext } from '../../contexts/Prefrence/PreferenceContext'
import { useMultiplayerContext } from '../../contexts/Multiplayer/MultiplayerContext';

import Players from './Players';
import Code from './RoomCode';

import { BsFlagFill } from 'react-icons/bs';

import {
    Box,
    Text,
    Flex,
    Input,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
  } from '@chakra-ui/react';

// eslint-disable-next-line react/display-name
const TypingInput = forwardRef(({ className }, ref) => {
    const [duration, setDuration] = useState(() => 0);
    const [isFocused, setIsFocused] = useState(() => false);
    const letterElements = useRef(null);
    const [currentTime, setCurrentTime] = useState(() => Date.now());

    const {
      preferences: { isOpen },
    } = usePreferenceContext();

    const {
      room: {
        text,
        isPlaying,
        isFinished,
        socket,
        winner,
        mode,
        user: { roomId, id, isOwner },
      },
      dispatch,
      timeBeforeRestart,
    } = useMultiplayerContext();

    useEffect(() => {
      let progress = Math.floor(((currIndex + 1) / text.length) * 100);
      const wpm =
        duration === 0
          ? Math.ceil(((60 / currentTime) * correctChar) / 5)
          : Math.ceil(((60 / duration) * correctChar) / 5);

      if (isFinished) {
        progress = 100;
        !winner && socket.emit('end game', roomId, mode);
      }

      dispatch({ type: 'SET_STATUS', payload: { wpm, progress } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentTime, isFinished]);

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
    } = useTyping(text, { skipCurrentWordOnSpace: false, pauseOnError: true });

    const [margin, setMargin] = useState(() => 0);
    const [value, setValue] = useState(() => '');

    // set cursor
    const pos = useMemo(() => {
      if (text.length !== 0 && currIndex + 1 === text.length) {
        dispatch({ type: 'SET_IS_FINISHED', payload: true });
      }
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currIndex, text.length]);

    useEffect(() => {
      if (id && roomId) {
        socket.off('words generated').on('words generated', (text) => {
          dispatch({ type: 'SET_TEXT', payload: text });
          setValue('');
          setMargin(0);
          setCurrentTime(Date.now());
          endTyping();
          resetTyping();
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, roomId]);

    //set WPM
    useEffect(() => {
      if (phase === 2 && endTime && startTime) {
        const dur = Math.floor((endTime - startTime) / 1000);
        setDuration(dur);
      } else {
        setDuration(0);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase, startTime, endTime, ref]);

    //handle key presses
    const handleKeyDown = (letter, control) => {
      if (letter === 'Backspace') {
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

    useEffect(() => {
      const timerInterval = setInterval(() => {
        if (startTime) {
          setCurrentTime(() => Math.floor((Date.now() - startTime) / 1000));
        }
      }, 1000);
      if (phase === 2) {
        clearInterval(timerInterval);
      }

      return () => clearInterval(timerInterval);
    }, [startTime, phase]);

    return (
        <Flex position='relative' maxW='950px' width='100%' flexDirection='column'>
            <Text pos='absolute' left='0' top='-20' zIndex='40'>
                <Text color='green.300'>{currIndex + 1} / {!text.length ? (<div>lol</div>) : (text.length)}</Text>
                <Players />
            </Text>
            <Text pos='absolute' right='0' top='-20' zIndex='40'>
                <Code />
            </Text>

            <Flex pos='absolute' left='0' top='-40' zIndex='40' fontSize='md' fontWeight='600' color='green.300' background='gray.700' rounded='2xl' padding='1rem'>
            {isPlaying ? (
              <span>
                Click
                or press any key to focus
              </span>
            ) : (
              <span>
                {' '}
                {timeBeforeRestart && !winner
                  ? `Starting in ${timeBeforeRestart}`
                  : isOwner
                  ? 'Waiting for you to start the game'
                  : 'Waiting for owner to start the game'}
              </span>
            )}
            </Flex>

            <Box
            pos='relative'
            zIndex='40'
            height='140px'
            width='100%'
            fontSize='2xl'
            outline='0'
            onClick={() => {
                if (ref != null && typeof ref !== 'function') {
                ref?.current?.focus();
                }
                setIsFocused(true);
            }}
            >
            <Input
                type='text'
                className='absolute left-0 top-0 z-20 h-full w-full cursor-default opacity-0'
                position='absolute'
                left='0'
                top='0'
                zIndex='20'
                height='100%'
                width='100%'
                cursor='default'
                opacity='0'
                tabIndex={isPlaying ? 1 : -1}
                ref={ref}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                value={value}
                onChange={(e) => {
                    setValue((prev) => {
                    if (prev.length > e.target.value.length) {
                        handleKeyDown('Backspace', false);
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
                    ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(
                        e.key
                    )
                    )
                    e.preventDefault();
                }}
            />
            <Box 
            position='absolute'
            top='0'
            left='0'
            marginBottom='4'
            height='100%'
            width='100%'
            overflow='hidden'
            textAlign='justify'
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
                {text.split('').map((letter, index) => {
                const state = charsState[index];
                const color =
                  state === 0
                    ? 'graygame'
                    : state === 1
                    ? 'greengame'
                    : 'redgame';
                return (
                  <span
                    key={letter + index}
                    className={`${color} ${
                      state === 0 &&
                      index < currIndex &&
                      'currentgame'
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
              className='animatedcursor'
              style={{
                left: pos.top < 0 ? -2 : pos.left,
                top: pos.top < 0 ? 2 : pos.top + 2,
              }}
            >
              {phase === 2 ? (
                <Box pos='relative' zIndex='40'>
                  <BsFlagFill style={{marginBottom: '4px'}} />
                </Box>
              ) : (
                '|'
              )}
            </span>
          ) : null}
        <Flex pos='absolute' right='0' top='-40' zIndex='40' fontSize='md' fontWeight='600' color='green.300' background='gray.700' rounded='2xl' padding='1rem'>
            {winner ? (
                <Stat>
                    <StatLabel>Time: {duration} s</StatLabel>
                    <StatNumber>{Math.round(((60 / duration) * correctChar) / 5)} WPM</StatNumber>
                    <StatHelpText>{(((correctChar - errorChar) / (currIndex + 1)) * 100).toFixed(
                    2
                    )}
                    % Accuracy</StatHelpText>
                </Stat>
            ) : '?'}
            </Flex>
        </Box>
        </Flex>
    );
  }
);

export default TypingInput;