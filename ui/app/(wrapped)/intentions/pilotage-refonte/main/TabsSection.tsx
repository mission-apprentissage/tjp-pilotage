import { Button, Flex, Img, Tab, TabList, Tabs, Text } from "@chakra-ui/react";

import { DisplayTypeEnum } from "./displayTypeEnum";

export const TabsSection = ({
  displayType,
  displayRepartition,
  displayQuadrant,
}: {
  displayType: DisplayTypeEnum;
  displayRepartition: () => void;
  displayQuadrant: () => void;
}) => {
  const getTabIndex = () => {
    if (displayType === DisplayTypeEnum.repartition) return 0;
    if (displayType === DisplayTypeEnum.quadrant) return 1;
  };

  const isRepartitionSelected = displayType === DisplayTypeEnum.repartition;
  const isQuadrantSelected = displayType === DisplayTypeEnum.quadrant;

  return (
    <Tabs
      isLazy={true}
      index={getTabIndex()}
      display="flex"
      flex="1"
      flexDirection="column"
      variant="enclosed-colored"
      minHeight="0"
      width={"100%"}
    >
      <TabList>
        <Tab
          as={Button}
          onClick={() => displayRepartition()}
          color={"black"}
          h={"102px"}
          w={"300px"}
          _hover={{ bg: "bluefrance.975_hover" }}
          bg={"bluefrance.975"}
        >
          <Flex
            direction={"column"}
            justify={"center"}
            alignItems={"center"}
            mx={"80px"}
          >
            {isRepartitionSelected ? (
              <Img
                src={`/icons/repartition_selected.svg`}
                alt="quadrant"
                w={"32px"}
                h={"32px"}
              />
            ) : (
              <Img
                src={`/icons/repartition.svg`}
                alt="quadrant"
                w={"32px"}
                h={"32px"}
              />
            )}
            <Text
              fontWeight={isRepartitionSelected ? 700 : 400}
              color={isRepartitionSelected ? "bluefrance.113" : "black"}
            >
              Répartition globale
            </Text>
          </Flex>
        </Tab>
        <Tab
          as={Button}
          onClick={() => displayQuadrant()}
          color={"black"}
          h={"102px"}
          w={"300px"}
          _hover={{ bg: "bluefrance.975_hover" }}
          bg={"bluefrance.975"}
        >
          <Flex
            direction={"column"}
            justify={"center"}
            alignItems={"center"}
            mx={"80px"}
          >
            {isQuadrantSelected ? (
              <Img
                src={`/icons/quadrant_selected.svg`}
                alt="quadrant"
                w={"32px"}
                h={"32px"}
              />
            ) : (
              <Img
                src={`/icons/quadrant.svg`}
                alt="quadrant"
                w={"32px"}
                h={"32px"}
              />
            )}
            <Text
              fontWeight={isQuadrantSelected ? 700 : 400}
              color={isQuadrantSelected ? "bluefrance.113" : "black"}
            >
              Quadrant
            </Text>
          </Flex>
        </Tab>
      </TabList>
    </Tabs>
  );
};
