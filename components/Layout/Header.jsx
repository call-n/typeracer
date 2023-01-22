import Link from "next/link";
import { FaCrown, FaKeyboard, FaUser } from "react-icons/fa";
import { RiTeamFill } from "react-icons/ri";
import { TbKeyboard } from "react-icons/tb";
import { Box, Flex, Container, Stack, Icon, Heading } from "@chakra-ui/react";

import { usePreferenceContext } from "../../contexts/Prefrence/PreferenceContext";
import { useUserContext } from "../../contexts/UserContext";

const typeList = ["words", "sentences"];
const timeList = ["15", "30", "45", "60", "120"];

export default function Header() {
  const {
    preferences: { type, time },
    dispatch,
  } = usePreferenceContext();
  const { currentUser, logout } = useUserContext();

  console.log(currentUser);

  return (
    <Box>
      <Flex
        as={"header"}
        pos="fixed"
        top="0"
        w={"full"}
        minH={"60px"}
        boxShadow={"md"}
        zIndex="999"
        justify={"center"}
      >
        <Container as={Flex} maxW={"7xl"} align={"center"}>
          <Flex
            flex={{ base: 1, md: "auto" }}
            justify={{ base: "start", md: "start" }}
          >
            <Link href={"/"} passHref>
              <Stack
                as={"a"}
                direction={"row"}
                alignItems={"center"}
                spacing={{ base: 2, sm: 4 }}
              >
                <Icon as={TbKeyboard} w={{ base: 8 }} h={{ base: 8 }} />
                <Heading
                  as={"h1"}
                  fontSize={"xl"}
                  display={{ base: "none", md: "block" }}
                >
                  <Box
                    as={"span"}
                    color="green.400"
                    position={"relative"}
                    zIndex={10}
                    _after={{
                      content: '""',
                      position: "absolute",
                      left: 0,
                      bottom: 0,
                      w: "full",
                      h: "30%",
                      bg: "green.900",
                      zIndex: -1,
                    }}
                  >
                    TypeRacer
                  </Box>
                  | {currentUser && currentUser.displayName}
                </Heading>
              </Stack>
            </Link>
          </Flex>

          {currentUser && <Box onClick={() => logout()}>Log out</Box>}

          <Stack
            direction={"row"}
            align={"center"}
            spacing={{ base: 6, md: 8 }}
            flex={{ base: 1, md: "auto" }}
            justify={"flex-end"}
          >
            <Stack
              display={{ base: "none", md: "flex" }}
              direction={"row"}
              spacing={4}
            >
              <Box>
                <Link href="/singleplayer">
                  <FaKeyboard />
                </Link>
              </Box>
              <Box>
                <Link href="/leaderboard">
                  <FaCrown />
                </Link>
              </Box>
              <Box>
                <Link href="/multiplayer">
                  <RiTeamFill />
                </Link>
              </Box>
              {currentUser ? (
                <Box>
                  <Link href="/account">
                    <FaUser />
                  </Link>
                </Box>
              ) : (
                <Box>
                  <Link href="/login">
                    <FaUser />
                  </Link>
                </Box>
              )}
            </Stack>
            <Stack
              display={{ base: "none", md: "flex" }}
              direction={"column"}
              spacing={1}
              fontWeight="600"
            >
              <Stack
                display={{ base: "none", md: "flex" }}
                direction={"row"}
                spacing={4}
              >
                {typeList.map((item) => (
                  <Box
                    onClick={() =>
                      dispatch({ type: "SET_TYPE", payload: item })
                    }
                    key={item}
                    color={`${item === type ? "green.600" : "green.200"}`}
                    cursor="pointer"
                  >
                    {item}
                  </Box>
                ))}
              </Stack>
              <Stack
                display={{ base: "none", md: "flex" }}
                direction={"row"}
                spacing={4}
              >
                {timeList.map((item) => (
                  <Box
                    onClick={() =>
                      dispatch({ type: "SET_TIME", payload: item })
                    }
                    key={item}
                    color={`${item === time ? "green.600" : "green.200"}`}
                    cursor="pointer"
                    _hover={{
                      color: "green.400",
                    }}
                  >
                    {item}
                  </Box>
                ))}
              </Stack>
            </Stack>
          </Stack>
        </Container>
      </Flex>
    </Box>
  );
}
