import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import AnimatedTransition from '../../components/Layout/AnimatedTransition';
import {
  Flex,
  Container,
  Heading,
  Stack,
  Button,
  FormControl,
  Input,
} from '@chakra-ui/react';
import { createRoom } from '../../lib/roomHandler';
import { useMultiplayerContext } from '../../contexts/Multiplayer/MultiplayerContext';
import { useToast } from '@chakra-ui/react'

const Index = () => {
    const [isCreatingRoom, setIsCreatingRoom] = useState(false);
    const [isJoiningRoom, setIsJoiningRoom] = useState(false);
	const codeRef = useRef();

    const {
        room: { socket, mode },
        dispatch,
        resetTime,
    } = useMultiplayerContext();

    const router = useRouter();
    const toast = useToast();

    useEffect(() => {
        socket.emit('hi', 'hello');

        // create another room id if already exist
        socket.off('room already exist').on('room already exist', () => {
            createRoom(socket, mode);
        });

        socket.off('end game').on('end game', () => {
            dispatch({ type: 'SET_STATUS', payload: { progress: 0, wpm: 0 } });
            dispatch({ type: 'SET_IS_READY', payload: false });
            dispatch({ type: 'SET_IS_PLAYING', payload: false });
            dispatch({ type: 'SET_IS_FINISHED', payload: false });
            dispatch({ type: 'SET_WINNER', payload: null });
            resetTime(0);
        });

        // on create room success, redirect to that room
        socket
            .off('create room success')
            .on('create room success', (roomId) => {
                toast({
                    title: 'Room successfully created!',
                    status: 'success',
                    duration: 4000,
                    isClosable: true,
                })
                setIsCreatingRoom(false);
                dispatch({ type: 'SET_IS_OWNER', payload: true });
                router.push(`/multiplayer/${roomId}`);
            });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    console.log(socket)

    socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
      });

    const handleSubmit = async (e) => {
		e.preventDefault();

		setIsJoiningRoom(true);
        router.push(`/multiplayer/${codeRef.current.value}`);
	};

  return (
    <AnimatedTransition>
      <Container maxW={'5xl'} height='85vh' display='flex' justifyContent='center' alignItems='center'>
      <Stack
        textAlign={'center'}
        align={'center'}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}>
        <Heading
          fontWeight={600}
          fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}
          lineHeight={'110%'}>
          Multiplayer mode!
        </Heading>
        <Flex
        align={'center'}
        justify={'center'}
        bg={'gray.800'}>
        <Container
            maxW={'lg'}
            boxShadow={'dark-lg'}
            rounded={'lg'}
            p={6}
            direction={'column'}>
            <Heading
            as={'h2'}
            fontSize={{ base: 'xl', sm: '2xl' }}
            textAlign={'center'}
            mb={5}>
            Join with room ID
            </Heading>
                <Stack
                direction={{ base: 'column', md: 'row' }}
                as={'form'}
                spacing={'12px'}
                onSubmit={handleSubmit}
                >
                <FormControl>
                    <Input
                    variant={'solid'}
                    borderWidth={1}
                    color={'gray.800'}
                    _placeholder={{
                        color: 'gray.400',
                    }}
                    borderColor={'gray.300'}
                    id={'code'}
                    required
                    placeholder={'Room ID'}
                    disabled={isJoiningRoom}
                    ref={codeRef}
                    />
                </FormControl>
                <FormControl w={{ base: '100%', md: '40%' }}>
                    <Button
                    isLoading={isJoiningRoom}
                    w="100%"
                    bg={'green.400'}
                    type={'submit'}>
                    Join
                    </Button>
                </FormControl>
                </Stack>
            </Container>
        </Flex>
        <Heading
          fontWeight={600}
          fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
          lineHeight={'110%'}>
          OR
        </Heading>
        <Stack spacing={6} direction={'row'}>
          <Button
            rounded={'full'}
            px={6}
            colorScheme={'green'}
            bg={'gray.800'}
            border={'2px solid'}
            borderColor={mode === 'words' ? 'green.400' : 'gray.800'}
            _hover={{borderColor: 'green.400'}}
            onClick={(e) => {
                dispatch({ type: 'SET_MODE', payload: 'words' })
            }}
            >
                Words
          </Button>
          <Button 
            rounded={'full'}
            px={6}
            colorScheme={'green'}
            bg={'gray.800'}
            border={'2px solid'}
            borderColor={mode === 'sentences' ? 'green.400' : 'gray.800'}
            _hover={{borderColor: 'green.400'}}
            onClick={(e) => {
                        dispatch({ type: 'SET_MODE', payload: 'sentences' })
                    }}
            >
                Sentences
          </Button>
        </Stack>
        <Button 
            rounded={'full'}
            px={6}
            colorScheme={'green'}
            bg={'green.400'}
            boxShadow={'dark-lg'}
            _hover={{ bg: 'green.500' }}
            isLoading={isCreatingRoom}
            onClick={() => {
                setIsCreatingRoom(true);
                createRoom(socket, mode);
            }}
            >
            Create New Room
        </Button>
      </Stack>
    </Container>
    </AnimatedTransition>
  )
}

export default Index