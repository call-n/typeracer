import { useRouter } from 'next/router'
import { useRef, useState } from "react";
import { useUserContext } from "../contexts/UserContext";
import AnimatedTransition from '../components/Layout/AnimatedTransition';
import Link from "next/link";
import { 
    Button,
    Container,
    Stack,
    FormControl,
    FormLabel,
    FormHelperText,
    Input,
    Box,
} from '@chakra-ui/react'


const Signup = () => {
	const displayNameRef = useRef();
	const emailRef = useRef();
	const passwordRef = useRef();
	const passwordConfirmRef = useRef();
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const { register } = useUserContext();
    const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();

		//checks for matching passwords
		if (passwordRef.current.value !== passwordConfirmRef.current.value) {
			return setError("The passwords does not match");
		}

		setError(null);
		try {
			setLoading(true);
			await register(
				emailRef.current.value,
				passwordRef.current.value,
				displayNameRef.current.value,
			);

			setLoading(false);
			router.push('/');
		} catch (err) {
			setError(err.message);
			setLoading(false);
			console.log(err);
		}
	};

	return (
        <AnimatedTransition>
            <Container maxW={'5xl'} height='85vh' display='flex' justifyContent='center' alignItems='center'>
                <Stack
                textAlign={'center'}
                align={'center'}
                spacing={{ base: 8, md: 10 }}
                py={{ base: 20, md: 28 }}>
                    <form onSubmit={handleSubmit}>

                        <FormControl >
                            <FormLabel>Name</FormLabel>
                            <Input type='text' ref={displayNameRef} />
                            <FormHelperText>Please enter your Name</FormHelperText>
                        </FormControl>

                        <FormControl >
                            <FormLabel>Email</FormLabel>
                            <Input type='email' ref={emailRef} />
                            <FormHelperText>Please enter your Email</FormHelperText>
                        </FormControl>

                        <FormControl >
                            <FormLabel>Password</FormLabel>
                            <Input type='password' ref={passwordRef} />
                            <FormHelperText>Please enter your Password</FormHelperText>
                        </FormControl>

                        <FormControl >
                            <FormLabel>Password</FormLabel>
                            <Input type='password' ref={passwordConfirmRef} />
                            <FormHelperText>Please enter your Password</FormHelperText>
                        </FormControl>
                        
                        {error && (
                            <div>
                                <span>{error}</span>
                            </div>
			    	    )}

                        <Button
                            mt={4}
                            colorScheme='teal'
                            isLoading={loading}
                            type='submit'
                        >
                            Create Account
                        </Button>
                    </form>
                    <Box color="green.200" textDecoration="underline">
                        <Link href="/login">Log in instead?</Link>
                    </Box>
                </Stack>
            </Container>
        </AnimatedTransition>
	);
};

export default Signup;