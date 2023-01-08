import { useEffect } from 'react'
import { useRouter } from 'next/router';
import AnimatedTransition from '../components/Layout/AnimatedTransition';
import {
  Flex,
  Container,
  Heading,
  Stack,
  Text,
  Box,
} from '@chakra-ui/react';
import { useUserContext } from '../contexts/UserContext';
import AccountDetails from '../components/AccountDetails';


const Account = () => {
    const {
        currentUser,
    } = useUserContext();
    const router = useRouter();

    useEffect(() => {
        if(!currentUser){
            router.push('/login')
        }
    },[currentUser, router])

  return (
    <AnimatedTransition>
      <Container maxW={'5xl'} height='85vh' display='flex' justifyContent='center' alignItems='center'>
      <Stack
        textAlign={'center'}
        align={'center'}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}>
        <Stack spacing={{ base: 6, md: 10 }}>
          <Box as={'header'}>
            <Text
              color={'gray.400'}
              fontWeight={300}
              fontSize={'2xl'}>
              Welcome back
            </Text>
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: '2xl', sm: '4xl', lg: '5xl' }}>
              {currentUser?.displayName}
            </Heading>
          </Box>
            <Text
            color={'gray.400'}
            fontSize={'2xl'}
            fontWeight={'300'}>
            Hope you have had a nice time here!
            </Text>
            {currentUser && (
                <AccountDetails />
            )}
        </Stack>
      </Stack>
    </Container>
    </AnimatedTransition>
  )
}

export default Account