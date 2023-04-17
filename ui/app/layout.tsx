"use client";
import "./globals.css";
import "react-notion-x/src/styles.css";

import { CacheProvider } from "@chakra-ui/next-js";
import { Box, ChakraProvider, Flex } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
  const queryClient = new QueryClient();

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
        <QueryClientProvider client={queryClient}>
          <CacheProvider>
            <ChakraProvider theme={theme}>
              <Flex direction="column" height="100vh" overflow="auto">
                <Header />
                <Box
                  display="flex"
                  flexDirection="column"
                  flex={1}
                  minHeight="0"
                >
                  {children}
                </Box>
              </Flex>
            </ChakraProvider>
          </CacheProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
