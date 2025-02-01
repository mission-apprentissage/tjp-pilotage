"use client";
import "react-notion-x/src/styles.css";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import * as Sentry from "@sentry/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Crisp } from "crisp-sdk-web";
import { useSearchParams } from "next/navigation";
import PlausibleProvider from "next-plausible";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CampagneType } from "shared/schema/campagneSchema";

import { publicConfig } from "@/config.public";
import { theme } from "@/theme/theme";

import type { Changelog } from "./(wrapped)/changelog/changelogContext";
import { ChangelogContext } from "./(wrapped)/changelog/changelogContext";
import { GlossaireProvider } from "./(wrapped)/glossaire/glossaireContext";
import type { GlossaireEntries } from "./(wrapped)/glossaire/types";
import type { Auth} from "./context/authContext";
import { AuthContext } from "./context/authContext";
import { CodeRegionContext } from "./context/codeRegionContext";
import { CurrentCampagneContext } from "./context/currentCampagneContext";
import { UaisContext } from "./context/uaiContext";

interface RootLayoutClientProps {
  readonly children: React.ReactNode;
  readonly auth?: Auth;
  readonly changelog: Changelog;
  readonly glossaire: GlossaireEntries;
  readonly campagne?: CampagneType;
}

const useCrisp = () => {
  useEffect(() => {
    const token = publicConfig.crisp.token;
    if (publicConfig.env === "production" && token) {
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
      (!!param || (typeof localStorage !== "undefined" && localStorage.getItem("notracking") === "true"))
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
  if (publicConfig.env !== "production") return false;
  return !noTracking.current;
};

export default function RootLayoutClient({
  children,
  auth: initialAuth,
  changelog: initialChangelog,
  glossaire: initialGlossaire,
  campagne: initialCampagne
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
  const [campagne, setCampagne] = useState<CampagneType | undefined>(initialCampagne);

  const [codeRegion, setCodeRegion] = useState<string | undefined>(auth?.user.codeRegion);
  const [uais, setUais] = useState<Array<string> | undefined>(auth?.user.uais);

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
        <PlausibleProvider trackLocalhost={false} enabled={tracking} domain={publicConfig.host} />
      </head>
      <body suppressHydrationWarning={true}>
        <QueryClientProvider client={queryClient}>
          <CacheProvider>
            <ChakraProvider theme={theme}>
              <AuthContext.Provider value={{ auth, setAuth }}>
                <UaisContext.Provider value={{uais, setUais}}>
                  <CodeRegionContext.Provider value={{codeRegion, setCodeRegion}}>
                    <CurrentCampagneContext.Provider value={{campagne, setCampagne}}>
                      <GlossaireProvider initialEntries={initialGlossaire}>
                        <ChangelogContext.Provider value={{ changelog, setChangelog }}>
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
                    </CurrentCampagneContext.Provider>
                  </CodeRegionContext.Provider>
                </UaisContext.Provider>
              </AuthContext.Provider>
            </ChakraProvider>
          </CacheProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
