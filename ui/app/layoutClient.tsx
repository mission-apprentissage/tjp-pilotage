"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Crisp } from "crisp-sdk-web";
import { useSearchParams } from "next/navigation";
import PlausibleProvider from "next-plausible";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CampagneType } from "shared/schema/campagneSchema";

import { publicConfig } from "@/config.public";
import { theme } from "@/theme/theme";

import SSOInfo from "./(wrapped)/components/SSOInfo";
import { GlossaireProvider } from "./(wrapped)/glossaire/glossaireContext";
import type { GlossaireEntries } from "./(wrapped)/glossaire/types";
import type { Auth } from "./authContext";
import { AuthContext } from "./authContext";
import { CodeRegionContext } from "./codeRegionContext";
import { CurrentCampagneContext } from "./currentCampagneContext";
import { PreviousCampagneContext } from "./previousCampagneContext";
import { UaisContext } from "./uaiContext";

interface RootLayoutClientProps {
  readonly children: React.ReactNode;
  readonly auth?: Auth;
  readonly glossaire: GlossaireEntries;
  readonly previousCampagne?: CampagneType;
  readonly currentCampagne?: CampagneType;
  readonly codeRegion?: string;
  readonly uais?: Array<string>;
}

const useCrisp = () => {
  useEffect(() => {
    const token = publicConfig.crisp.token;
    if (publicConfig.env == "production" && token && !publicConfig.host.includes("education.gouv.fr")) {
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
  glossaire: initialGlossaire,
  currentCampagne: initialCurrentCampagne,
  previousCampagne: initialPreviousCampagne,
  codeRegion: initialCodeRegion,
  uais: initialUais,
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
  const [currentCampagne, setCurrentCampagne] = useState<CampagneType | undefined>(initialCurrentCampagne);
  const [previousCampagne, setPreviousCampagne] = useState<CampagneType | undefined>(initialPreviousCampagne);

  const [codeRegion, setCodeRegion] = useState<string | undefined>(initialCodeRegion);
  const [uais, setUais] = useState<Array<string> | undefined>(initialUais);

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
        <PlausibleProvider trackLocalhost={false} enabled={tracking} domain={publicConfig.host} />
      </head>
      <body suppressHydrationWarning={true}>
        <SSOInfo />
        <QueryClientProvider client={queryClient}>
          <CacheProvider>
            <ChakraProvider theme={theme}>
              <AuthContext.Provider value={{ auth, setAuth }}>
                <UaisContext.Provider value={{uais, setUais}}>
                  <CodeRegionContext.Provider value={{codeRegion, setCodeRegion}}>
                    <CurrentCampagneContext.Provider value={{
                      campagne: currentCampagne,
                      setCampagne: setCurrentCampagne
                    }}>
                      <PreviousCampagneContext.Provider value={{
                        campagne: previousCampagne,
                        setCampagne: setPreviousCampagne
                      }}>
                        <GlossaireProvider initialEntries={initialGlossaire}>
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
                        </GlossaireProvider>
                      </PreviousCampagneContext.Provider>
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
