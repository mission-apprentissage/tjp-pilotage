"use client";

import {
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

import { Arianne } from "@/app/components/Arianne";

const getTabIndex = (segment: string | null) => {
  if (segment === "formations") return 0;
  if (segment === "etablissements") return 1;
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const segment = useSelectedLayoutSegment();
  const tabIndex = getTabIndex(segment);
  return (
    <>
      <Container maxWidth={"container.xl"} py="4">
        <Arianne />
      </Container>
      <Tabs
        isLazy={true}
        index={tabIndex}
        display="flex"
        px={5}
        height="100%"
        flexDirection="column"
        variant="enclosed-colored"
      >
        <TabList px={5}>
          <Tab as={Link} href="/console/formations">
            Par formations
          </Tab>
          <Tab as={Link} href="/console/etablissements">
            Par établissement
          </Tab>
        </TabList>
        <TabPanels display="flex" flexDirection="column" flex="1">
          <TabPanel p="0" height="100%">
            {children}
          </TabPanel>
          <TabPanel p="0" height="100%">
            {children}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
