import { FaCrown } from "react-icons/fa";

import { useMultiplayerContext } from "../../contexts/Multiplayer/MultiplayerContext";

import { Box, Flex, Text } from "@chakra-ui/react";

export default function Players() {
  const {
    room: {
      user: { id },
      players,
      isPlaying,
      winner,
    },
  } = useMultiplayerContext();

  return (
    <Box>
      {players.map((player) =>
        player.id === id ? (
          <Flex
            key={player.id}
            flex="1"
            flexDir="col"
            alignItems="start"
            gap="2"
          >
            <Flex
              width="100%"
              alignItems="center"
              justifyContent="space-between"
            >
              <Flex alignItems="center">
                {winner === player.id && <FaCrown className="mr-1 text-fg" />}
                <Text color="green.300">You</Text>
                <Text fontSize="sm" marginLeft=".2rem">
                  (
                  {isPlaying
                    ? "in game"
                    : player.isOwner
                    ? "owner"
                    : "waiting for owner"}
                  )
                </Text>
              </Flex>
              <Text color="green.300" marginLeft=".2rem">
                {player.status.wpm} wpm
              </Text>
            </Flex>
          </Flex>
        ) : (
          <Flex
            key={player.id}
            flex="1"
            flexDir="col"
            alignItems="start"
            gap="2"
          >
            <Flex
              width="100%"
              alignItems="center"
              justifyContent="space-between"
            >
              <Flex alignItems="center">
                {winner === player.id && <FaCrown className="mr-1 text-fg" />}
                <Text color="green.300">{player.username}</Text>
                <Text fontSize="sm" marginLeft=".2rem">
                  (
                  {isPlaying
                    ? "in game"
                    : player.isOwner
                    ? "owner"
                    : "waiting for owner"}
                  )
                </Text>
              </Flex>
              <Text color="green.300" marginLeft=".2rem">
                {player.status.wpm} wpm
              </Text>
            </Flex>
          </Flex>
        )
      )}
    </Box>
  );
}
