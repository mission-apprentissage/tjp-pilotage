"use client";
import "./globals.css";
import "react-notion-x/src/styles.css";

import { CacheProvider } from "@chakra-ui/next-js";
import { Box, ChakraProvider, Flex } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import PlausibleProvider from "next-plausible";
import { useRef } from "react";

import { theme } from "../theme/theme";
import { Header } from "./components/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const tracking = useRef(searchParams.get("notracking") !== "true");

  return (
    <html lang="fr">
      <head>
        <PlausibleProvider
          trackLocalhost={false}
          enabled={tracking.current}
          domain="pilotage-recette.trajectoirespro.beta.gouv.fr"
        />
      </head>
      <body>
        <CacheProvider>
          <ChakraProvider theme={theme}>
            <Flex direction="column" height="100vh">
              <Header />
              <Box flex={1}>{children}</Box>
            </Flex>
          </ChakraProvider>
        </CacheProvider>
      </body>
    </html>
  );
}
