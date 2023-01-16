import React from 'react'
import GameBox from '../components/Game/GameBox';
import AnimatedTransition from '../components/Layout/AnimatedTransition';
import {
    Flex,
  } from '@chakra-ui/react';

const singleplayer = () => {
  return (
    <AnimatedTransition>
        <Flex minH='85vh' justifyContent='center' alignItems='center' >
            <GameBox />
        </Flex>
    </AnimatedTransition>
  )
}

export default singleplayer