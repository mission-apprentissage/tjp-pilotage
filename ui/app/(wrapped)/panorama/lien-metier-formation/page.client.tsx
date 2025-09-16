"use client";

import { Flex, Tab, TabList, Tabs, Text, VStack } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import NextLink from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { useState } from "react";

import DashboardFormation from "./formation/page";
import DashboardMetier from "./metier/page";

const getTabIndex = (segment: string | null) => {
  if (segment === "formation") return 0;
  if (segment === "metier") return 1;
};

export const PageClient = () => {
  const segment = useSelectedLayoutSegment();
  const tabIndex = getTabIndex(segment);

  const [displayType, setDisplayType] = useState<"formation" | "metier">("formation");

  return (
    <VStack gap="12px" py="16px" alignItems="start" width="100%">
      <Tabs
        isLazy={true}
        index={tabIndex}
        display="flex"
        flex="1"
        flexDirection="column"
        variant="blue-border"
        minHeight="0"
        width={"100%"}
      >
        <TabList>
          <Tab
            onClick={(e) => {
              setDisplayType("formation");
              e.preventDefault();
            }}
            as={NextLink}
            href="/panorama/lien-metier-formation/formation"
          >
            <Flex direction={"row"} justify={"center"} alignItems={"center"} p={3} gap={2}>
              <Icon icon="ri:book-open-line" />
              <Text>À partir d'une formation</Text>
            </Flex>
          </Tab>
          <Tab
            onClick={(e) => {
              setDisplayType("metier");
              e.preventDefault();
            }}
            as={NextLink}
            href="/panorama/lien-metier-formation/metier"
          >
            <Flex direction={"row"} justify={"center"} alignItems={"center"} p={3} gap={2}>
              <Icon icon="ri:briefcase-line" />
              <Text>À partir d'un métier</Text>
            </Flex>
          </Tab>
        </TabList>
      </Tabs>
      {displayType === "formation" ?
        (
          <DashboardFormation />
        ) : (
          <DashboardMetier />
        )
      }
    </VStack>
  );
};
