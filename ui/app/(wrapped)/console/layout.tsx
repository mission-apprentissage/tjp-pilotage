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
import { useSearchParams, useSelectedLayoutSegment } from "next/navigation";
import qs from "qs";

import { Breadcrumb } from "../../../components/Breadcrumb";
import { createParametrizedUrl } from "../../../utils/createParametrizedUrl";

const getTabIndex = (segment: string | null) => {
  if (segment === "formations") return 0;
  if (segment === "etablissements") return 1;
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const segment = useSelectedLayoutSegment();
  const tabIndex = getTabIndex(segment);
  const queryParams = useSearchParams();
  const filters = qs.parse(queryParams.toString())?.["filters"];
  const keptFilters = Object.fromEntries(
    Object.entries(filters ?? {}).filter(([filter]) =>
      ["codeRegion"].includes(filter)
    )
  );
  return (
    <>
      <Container maxWidth={"container.xl"} py="4">
        <Breadcrumb
          ml={4}
          pages={[
            { title: "Accueil", to: "/" },
            segment === "formations"
              ? { title: "Formations", to: "/console/formations", active: true }
              : {
                  title: "Etablissements",
                  to: "/console/etablissements",
                  active: true,
                },
          ]}
        />
      </Container>
      <Tabs
        isLazy={true}
        index={tabIndex}
        display="flex"
        px={5}
        flex="1"
        flexDirection="column"
        variant="enclosed-colored"
        minHeight="0"
      >
        <TabList px={5}>
          <Tab
            as={Link}
            href={createParametrizedUrl("/console/formations", {
              filters: keptFilters,
            })}
          >
            Par formation
          </Tab>
          <Tab
            as={Link}
            href={createParametrizedUrl("/console/etablissements", {
              filters: keptFilters,
            })}
          >
            Par établissement
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
    </>
  );
}
