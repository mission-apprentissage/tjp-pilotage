"use client";

import { Flex, Tab, TabList, Tabs, Text, VStack } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import NextLink from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import React from "react";

const getTabIndex = (segment: string | null) => {
  if (segment === "formation") return 0;
  if (segment === "metier") return 1;
};

const LienEmploiFormation = ({ children }: { children: React.ReactNode }) => {
  const segment = useSelectedLayoutSegment();
  const tabIndex = getTabIndex(segment);

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
          <Tab as={NextLink} href="/panorama/lien-emploi-formation/formation">
            <Flex
              direction={"row"}
              justify={"center"}
              alignItems={"center"}
              p={3}
              gap={2}
            >
              <Icon icon="ri:book-open-line" />
              <Text>À partir d'une formation</Text>
            </Flex>
          </Tab>
          <Tab as={NextLink} href="/panorama/lien-emploi-formation/metier">
            <Flex
              direction={"row"}
              justify={"center"}
              alignItems={"center"}
              p={3}
              gap={2}
            >
              <Icon icon="ri:briefcase-line" />
              <Text>À partir d'un métier</Text>
            </Flex>
          </Tab>
        </TabList>
      </Tabs>
      {children}
    </VStack>
  );
};

export default LienEmploiFormation;
