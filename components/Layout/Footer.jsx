import * as React from 'react';
import { TbKeyboard } from 'react-icons/tb';
import Link from 'next/link';
import {
    Icon,
    Box,
    Text,
    Flex,
  } from '@chakra-ui/react';

export default function Footer() {
  return (
    <Box
      bg='gray.900'
      color='gray.200'
      height='15vh'
      >
      <Box p={5}>
        <Flex
          align={'center'}
          _before={{
            content: '""',
            borderBottom: '1px solid',
            borderColor: 'gray.700',
            flexGrow: 1,
            mr: 8,
          }}
          _after={{
            content: '""',
            borderBottom: '1px solid',
            borderColor: 'gray.700',
            flexGrow: 1,
            ml: 8,
          }}>
          <Link href={'/'} passHref>
              <Icon as={TbKeyboard} w={{ base: 12 }} h={{ base: 12 }} color="green.400" />
          </Link>
        </Flex>
        <Text pt={6} fontSize={'sm'} textAlign={'center'}>
          Made on the Internet by call-n
        </Text>
      </Box>
    </Box>
  );
}