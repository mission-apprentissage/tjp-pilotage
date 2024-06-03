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

import { Breadcrumb } from "../../../components/Breadcrumb";

const getTabIndex = (segment: string | null) => {
  if (segment === "region") return 0;
  if (segment === "departement") return 1;
  if (segment === "etablissement") return 2;
  if (segment === "lien-metier-formation") return 3;
};

export default function PanoramaLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  const segment = useSelectedLayoutSegment();
  const tabIndex = getTabIndex(segment);

  const getPages = () => {
    if (segment === "region")
      return [
        { title: "Accueil", to: "/" },
        { title: "Panorama régional", to: "/panorama/region", active: true },
      ];
    if (segment === "departement")
      return [
        { title: "Accueil", to: "/" },
        {
          title: "Panorama départemental",
          to: "/panorama/departement",
          active: true,
        },
      ];
    if (segment === "lien-metier-formation")
      return [
        { title: "Accueil", to: "/" },
        {
          title: "Lien métier formation",
          to: "/panorama/lien-metier-formation",
          active: true,
        },
      ];
    return [
      { title: "Accueil", to: "/" },
      {
        title: "Panorama établissement",
        to: "/panorama/etablissement",
        active: true,
      },
    ];
  };

  return (
    <Container maxWidth={"container.xl"} py="4" pb={20}>
      <Breadcrumb mb={4} ml={4} pages={getPages()} />
      <Tabs
        isLazy={true}
        index={tabIndex}
        display="flex"
        flex="1"
        flexDirection="column"
        variant="enclosed-colored"
        minHeight="0"
      >
        <TabList>
          <Tab as={Link} href="/panorama/region">
            Région
          </Tab>
          <Tab as={Link} href="/panorama/departement">
            Département
          </Tab>
          <Tab as={Link} href="/panorama/etablissement">
            Établissement
          </Tab>
          <Tab as={Link} href="/panorama/lien-metier-formation">
            Lien emploi formation
          </Tab>
        </TabList>
        <TabPanels display="flex" flexDirection="column" flex="1" minHeight="0">
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
  );
}
