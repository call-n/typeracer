import { useRouter } from "next/router";
import { FaCopy } from "react-icons/fa";
import { useToast } from "@chakra-ui/react";
import { Box, Flex } from "@chakra-ui/react";

export default function Code() {
  const { query } = useRouter();
  const toast = useToast();

  return (
    <Flex
      pos="relative"
      zIndex="10"
      cursor="pointer"
      alignItems="center"
      rounded="md"
      fontWeight="bold"
      p=".5rem"
      paddingTop="1.2rem"
      fontSize="1.4rem"
      bg="gray.300"
      color="gray.900"
      onClick={() =>
        navigator.clipboard.writeText(query?.id).then(() =>
          toast({
            title: "Copy was succesfull!",
            description: "Now share it with your friends :)",
            status: "success",
            duration: 3000,
            isClosable: true,
          })
        )
      }
      className="relative z-10 flex cursor-pointer items-center rounded-md bg-hl px-4 pt-5 text-3xl font-bold text-bg"
    >
      <Box pos="absolute" top="1" left="2" fontSize="0.8rem">
        copy and share
      </Box>
      {query?.id ? query?.id + " " : <div>que?</div>}
      <FaCopy className="ml-2 text-2xl text-bg/80 transition-colors duration-200 hover:text-bg active:text-bg" />
    </Flex>
  );
}
