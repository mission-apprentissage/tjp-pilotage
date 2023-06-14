"use client";

import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { ReactNode } from "react";

const getTabIndex = (segment: string | null) => {
  if (segment === "region") return 0;
  if (segment === "etablissement") return 1;
};

export default function PanoramaLayout({ children }: { children: ReactNode }) {
  const segment = useSelectedLayoutSegment();
  const tabIndex = getTabIndex(segment);

  return (
    <>
      <Container maxWidth={"container.xl"} py="4">
        <Tabs
          isLazy={true}
          index={tabIndex}
          display="flex"
          flex="1"
          flexDirection="column"
          variant="enclosed-colored"
          minHeight="0"
        >
          <TabList px={5}>
            <Tab as={Link} href="/panorama/region">
              Région
            </Tab>
            <Tab as={Link} href="/panorama/etablissement">
              Etablissement
            </Tab>
          </TabList>
          <TabPanels
            display="flex"
            flexDirection="column"
            flex="1"
            minHeight="0"
          >
            <Box
              p="0"
              display="flex"
              flexDirection={"column"}
              flex="1"
              minHeight="0"
            >
              {children}
            </Box>
          </TabPanels>
        </Tabs>
      </Container>
    </>
  );
}
