"use client";
import "react-notion-x/src/styles.css";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PlausibleProvider from "next-plausible";
import { useSearchParams } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Auth, AuthContext } from "@/app/(wrapped)/auth/authContext";

import { theme } from "../theme/theme";
import {
  Changelog,
  ChangelogContext,
} from "./(wrapped)/changelog/changelogContext";
import { GlossaireProvider } from "./contexts/glossaireContext";

interface RootLayoutClientProps {
  children: React.ReactNode;
  auth?: Auth;
  changelog: Changelog;
}

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
  changelog: initialChangelog,
}: RootLayoutClientProps) {
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
  const [changelog, setChangelog] = useState<Changelog>(initialChangelog);
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

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
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
                    <GlossaireProvider>
                      <ChangelogContext.Provider
                        value={{ changelog, setChangelog }}
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
                      </ChangelogContext.Provider>
                    </GlossaireProvider>
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
