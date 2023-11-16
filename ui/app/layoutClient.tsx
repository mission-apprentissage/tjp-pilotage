"use client";
import "react-notion-x/src/styles.css";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import PlausibleProvider from "next-plausible";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { z } from "zod";

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
  console.log(z);
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

export const CodeRegionFilterContext = createContext<{
  codeRegionFilter: string;
  setCodeRegionFilter: Dispatch<SetStateAction<string>>;
}>({
  codeRegionFilter: "",
  setCodeRegionFilter: () => {},
});

export const CodeDepartementFilterContext = createContext<{
  codeDepartementFilter: string;
  setCodeDepartementFilter: Dispatch<SetStateAction<string>>;
}>({
  codeDepartementFilter: "",
  setCodeDepartementFilter: () => {},
});

export const UaiFilterContext = createContext<{
  uaiFilter: string;
  setUaiFilter: Dispatch<SetStateAction<string>>;
}>({
  uaiFilter: "",
  setUaiFilter: () => {},
});

export default function RootLayoutClient({
  children,
  auth: initialAuth,
}: {
  children: React.ReactNode;
  auth?: Auth;
}) {
  const tracking = useTracking();
  console.log("tr", tracking);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { useErrorBoundary: false, retry: false },
        },
      })
  );

  const [auth, setAuth] = useState<Auth | undefined>(initialAuth);
  const [codeRegionFilter, setCodeRegionFilter] = useState<string>(
    auth?.user.codeRegion ?? ""
  );
  const [uaiFilter, setUaiFilter] = useState("");

  const codeRegionFilterValue = useMemo(
    () => ({ codeRegionFilter, setCodeRegionFilter }),
    [codeRegionFilter]
  );
  const uaiFilterValue = useMemo(
    () => ({ uaiFilter, setUaiFilter }),
    [uaiFilter]
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollPosition = useRef<number>(0);

  // @ts-ignore
  const handleScrolling = (e: any) => {
    scrollPosition.current = e.target.scrollTop;
  };

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollTop = scrollPosition.current ?? 0;
  });

  return (
    <html lang="fr" data-theme="light">
      <head>
        <PlausibleProvider
          trackLocalhost={false}
          enabled={tracking}
          domain="orion.inserjeunes.beta.gouv.fr"
        />
      </head>
      <body suppressHydrationWarning={true}>
        <QueryClientProvider client={queryClient}>
          <CacheProvider>
            <ChakraProvider theme={theme}>
              <AuthContext.Provider value={{ auth, setAuth }}>
                <UaiFilterContext.Provider value={uaiFilterValue}>
                  <CodeRegionFilterContext.Provider
                    value={codeRegionFilterValue}
                  >
                    <Flex
                      direction="column"
                      height="100vh"
                      overflow="auto"
                      ref={containerRef}
                      onScroll={handleScrolling}
                    >
                      {children}
                    </Flex>
                  </CodeRegionFilterContext.Provider>
                </UaiFilterContext.Provider>
              </AuthContext.Provider>
            </ChakraProvider>
          </CacheProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
