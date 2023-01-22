import Link from "next/link";
import AnimatedTransition from "../components/Layout/AnimatedTransition";
import { Container, Heading, Stack, Text, Button } from "@chakra-ui/react";

export default function Home() {
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
          <Heading
            fontWeight={600}
            fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
            lineHeight={"110%"}
          >
            Typing fast{" "}
            <Text as={"span"} color={"green.400"}>
              made easy
            </Text>
          </Heading>
          <Text color={"gray.500"} maxW={"3xl"}>
            Play on your own or invite some friends, test you writing speed and
            see who get the best score. Everything will show up on the leader
            board.
          </Text>
          <Stack spacing={6} direction={"row"}>
            <Button
              rounded={"full"}
              px={6}
              colorScheme={"green"}
              bg={"green.400"}
              _hover={{ bg: "green.500" }}
            >
              <Link href="/singleplayer">Singleplayer</Link>
            </Button>
            <Button
              rounded={"full"}
              px={6}
              colorScheme={"green"}
              bg={"green.400"}
              _hover={{ bg: "green.500" }}
            >
              <Link href="/multiplayer">Multiplayer</Link>
            </Button>
          </Stack>
        </Stack>
      </Container>
    </AnimatedTransition>
  );
}
