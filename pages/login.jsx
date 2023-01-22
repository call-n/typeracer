import { useRouter } from "next/router";
import Link from "next/link";
import { useState, useRef } from "react";
import { useUserContext } from "../contexts/UserContext";
import AnimatedTransition from "../components/Layout/AnimatedTransition";
import {
  Button,
  Container,
  Stack,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Box,
} from "@chakra-ui/react";

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useUserContext();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      router.push("/");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <AnimatedTransition>
      <Container
        maxW={"5xl"}
        height="85vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Stack
          textAlign={"center"}
          align={"center"}
          spacing={{ base: 8, md: 10 }}
          py={{ base: 20, md: 28 }}
        >
          <h2 className="flex text-left text-xl font-thin">login</h2>
          <form onSubmit={handleSubmit}>
            <FormControl>
              <FormLabel>Email address</FormLabel>
              <Input type="email" ref={emailRef} />
              <FormHelperText>Please enter your email</FormHelperText>
            </FormControl>

            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input type="password" ref={passwordRef} />
              <FormHelperText>Please enter your password</FormHelperText>
            </FormControl>

            {error && (
              <div>
                <span>{error}</span>
              </div>
            )}

            <Button mt={4} colorScheme="teal" isLoading={loading} type="submit">
              Sign in
            </Button>
          </form>
          <Box color="green.200" textDecoration="underline">
            <Link href="/register">No account? Register instead then!</Link>
          </Box>
        </Stack>
      </Container>
    </AnimatedTransition>
  );
};

export default Login;
