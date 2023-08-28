"use client";
import "react-notion-x/src/styles.css";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import PlausibleProvider from "next-plausible";
import { useEffect, useRef, useState } from "react";

import { Auth, AuthContext } from "@/app/(wrapped)/auth/authContext";

import { theme } from "../theme/theme";

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
  return !noTracking.current;
};

export default function RootLayoutClient({
  children,
  auth: initialAuth,
}: {
  children: React.ReactNode;
  auth?: Auth;
}) {
  const tracking = useTracking();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { mutations: { useErrorBoundary: false } },
      })
  );

  const [auth, setAuth] = useState<Auth | undefined>(initialAuth);

  return (
    <html lang="fr" data-theme="light">
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
              <AuthContext.Provider value={{ auth, setAuth }}>
                <Flex direction="column" height="100vh" overflow="auto">
                  {children}
                </Flex>
              </AuthContext.Provider>
            </ChakraProvider>
          </CacheProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
