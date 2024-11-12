"use client";
import "react-notion-x/src/styles.css";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import * as Sentry from "@sentry/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Crisp } from "crisp-sdk-web";
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

import { Auth, AuthContext } from "@/app/(wrapped)/auth/authContext";

import { theme } from "../theme/theme";
import {
  Changelog,
  ChangelogContext,
} from "./(wrapped)/changelog/changelogContext";
import { GlossaireProvider } from "./(wrapped)/glossaire/glossaireContext";
import { GlossaireEntries } from "./(wrapped)/glossaire/types";

interface RootLayoutClientProps {
  readonly children: React.ReactNode;
  readonly auth?: Auth;
  readonly changelog: Changelog;
  readonly glossaire: GlossaireEntries;
}

const useCrisp = () => {
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_CRISP_TOKEN;
    if (process.env.NEXT_PUBLIC_ENV === "production" && token) {
      Crisp.configure(token);
    } else {
      console.log("Crisp disabled");
    }
  }, []);
};

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
  codeRegionFilter?: string;
  setCodeRegionFilter: Dispatch<SetStateAction<string | undefined>>;
}>({
  codeRegionFilter: "",
  setCodeRegionFilter: () => {},
});

export const CodeDepartementFilterContext = createContext<{
  codeDepartementFilter?: string;
  setCodeDepartementFilter: Dispatch<SetStateAction<string | undefined>>;
}>({
  codeDepartementFilter: "",
  setCodeDepartementFilter: () => {},
});

export const UaisFilterContext = createContext<{
  uaisFilter?: Array<string>;
  setUaisFilter: Dispatch<SetStateAction<Array<string> | undefined>>;
}>({
  uaisFilter: [],
  setUaisFilter: () => {},
});

export default function RootLayoutClient({
  children,
  auth: initialAuth,
  changelog: initialChangelog,
  glossaire: initialGlossaire,
}: RootLayoutClientProps) {
  useCrisp();
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

  const [codeRegionFilter, setCodeRegionFilter] = useState<string | undefined>(
    auth?.user.codeRegion
  );
  const [uaisFilter, setUaisFilter] = useState<Array<string> | undefined>(
    auth?.user.uais
  );

  const codeRegionFilterValue = useMemo(
    () => ({ codeRegionFilter, setCodeRegionFilter }),
    [codeRegionFilter]
  );

  const uaisFilterValue = useMemo(
    () => ({ uaisFilter, setUaisFilter }),
    [uaisFilter]
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollPosition = useRef<number>(0);

  if (initialAuth) {
    if (initialAuth.user) {
      Sentry.setUser({ id: initialAuth.user.id });
      Sentry.setTag("role", initialAuth.user?.role);
    }
  }

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
                <UaisFilterContext.Provider value={uaisFilterValue}>
                  <CodeRegionFilterContext.Provider
                    value={codeRegionFilterValue}
                  >
                    <GlossaireProvider initialEntries={initialGlossaire}>
                      <ChangelogContext.Provider
                        value={{ changelog, setChangelog }}
                      >
                        <Flex
                          direction="column"
                          height="100vh"
                          overflow="auto"
                          position="relative"
                          ref={containerRef}
                          onScroll={handleScrolling}
                        >
                          {children}
                        </Flex>
                      </ChangelogContext.Provider>
                    </GlossaireProvider>
                  </CodeRegionFilterContext.Provider>
                </UaisFilterContext.Provider>
              </AuthContext.Provider>
            </ChakraProvider>
          </CacheProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
