'use client';
import '../styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import { PreferenceProvider } from '../contexts/PreferenceContext';
import Layout from '../components/Layout/Layout';
import { theme } from '../components/theme';
import { AnimatePresence } from 'framer-motion';
import UserContext from '../contexts/UserContext';

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <PreferenceProvider>
        <UserContext>
          <Layout>
            <AnimatePresence>
              <Component {...pageProps} />
            </AnimatePresence>
          </Layout>
        </UserContext>
      </PreferenceProvider>
    </ChakraProvider>
  );
}
