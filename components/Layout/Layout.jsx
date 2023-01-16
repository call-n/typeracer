import NextNProgress from 'nextjs-progressbar';
import { useState, useEffect } from 'react';

import {
    Box,
    Flex,
    Progress,
  } from '@chakra-ui/react';

import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  return (
    <>
      {isLoading ? (
        <>
          <Box pos='fixed' width='100%' height='100vh' alignItems='center' justifyContent='center' background='gray.800' color='whiteAlpha.900'>
            <Flex flexWrap='wrap' alignItems='center' justifyContent='center' width='100%' height='100%' >
              <Flex flexDir='column'>
                <Box>
                  typerajcer
                </Box>
                <Box>
                  Preparing the page for you...
                </Box>
                <Progress size='xs' isIndeterminate marginTop='1rem' />
              </Flex>
            </Flex>
          </Box>
        </>
      ) : (
        <Box background='gray.800' color='whiteAlpha.900'>
          <Flex width='100%' flexDirection='column'>
            <NextNProgress
              color={`green.200`}
              startPosition={0.3}
              stopDelayMs={200}
              height={2}
              showOnShallow={true}
            />
            <Header />
            {children}
            <Footer />
          </Flex>
        </Box>
      )}
    </>
  );
}
