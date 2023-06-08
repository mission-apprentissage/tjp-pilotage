"use client";
import "./globals.css";
import "react-notion-x/src/styles.css";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import PlausibleProvider from "next-plausible";
import { useEffect, useRef } from "react";

import { theme } from "../theme/theme";
import { Header } from "./components/Header";

const useTracking = () => {
  const searchParams = useSearchParams();
  const param = searchParams.get("notracking");
  const noTracking = useRef(
    param !== "reset" &&
      (!!param ||
        (typeof localStorage !== "undefined" &&
          localStorage.getItem("notracking") === "true"))
  );
  useEffect(() => {
    if (param === "reset") {
      localStorage.removeItem("notracking");
      return;
    }
    if (param) {
      localStorage.setItem("notracking", "true");
    }
  }, [param]);
  if (process.env.NEXT_PUBLIC_ENV !== "production") return false;
  return !!noTracking.current;
};

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const tracking = useTracking();
  const queryClient = new QueryClient();

  return (
    <html lang="fr">
      <head>
        <PlausibleProvider
          trackLocalhost={false}
          enabled={tracking}
          domain="orion.inserjeunes.beta.gouv.fr"
        />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <CacheProvider>
            <ChakraProvider theme={theme}>
              <Flex direction="column" height="100vh" overflow="auto">
                <Header />
                {children}
              </Flex>
            </ChakraProvider>
          </CacheProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
