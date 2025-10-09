"use client";

import { ChakraProvider, Flex } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLayoutEffect, useRef, useState } from "react";
import type { CampagneType } from "shared/schema/campagneSchema";

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

export default function RootLayoutClient({
  children,
  auth: initialAuth,
  glossaire: initialGlossaire,
  currentCampagne: initialCurrentCampagne,
  previousCampagne: initialPreviousCampagne,
  codeRegion: initialCodeRegion,
  uais: initialUais,
}: RootLayoutClientProps) {
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
      </head>
      <body suppressHydrationWarning={true}>
        <SSOInfo />
        <QueryClientProvider client={queryClient}>
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
        </QueryClientProvider>
      </body>
    </html>
  );
}
