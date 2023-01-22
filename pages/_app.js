"use client";
import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { PreferenceProvider } from "../contexts/Prefrence/PreferenceContext";
import Layout from "../components/Layout/Layout";
import { theme } from "../components/theme";
import { AnimatePresence } from "framer-motion";
import UserContext from "../contexts/UserContext";
import { MultiplayerProvider } from "../contexts/Multiplayer/MultiplayerContext";

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <PreferenceProvider>
        <UserContext>
          <MultiplayerProvider>
            <Layout>
              <AnimatePresence>
                <Component {...pageProps} />
              </AnimatePresence>
            </Layout>
          </MultiplayerProvider>
        </UserContext>
      </PreferenceProvider>
    </ChakraProvider>
  );
}
