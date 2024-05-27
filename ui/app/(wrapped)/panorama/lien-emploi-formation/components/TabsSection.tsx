import { Button, Flex, Tab, TabList, Tabs, Text } from "@chakra-ui/react";
import { Icon } from "@iconify/react";

import { DisplayTypeEnum } from "./displayTypeEnum";

export const TabsSection = ({
  displayType,
  setDisplayType,
}: {
  displayType: DisplayTypeEnum;
  setDisplayType: (displayType: DisplayTypeEnum) => void;
}) => {
  const getTabIndex = () => {
    if (displayType === DisplayTypeEnum.formation) return 0;
    if (displayType === DisplayTypeEnum.metier) return 1;
  };

  return (
    <Tabs
      isLazy={true}
      index={getTabIndex()}
      display="flex"
      flex="1"
      flexDirection="column"
      variant="blue-border"
      minHeight="0"
      width={"100%"}
    >
      <TabList>
        <Tab
          as={Button}
          onClick={() => setDisplayType(DisplayTypeEnum.formation)}
        >
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
        <Tab as={Button} onClick={() => setDisplayType(DisplayTypeEnum.metier)}>
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
  );
};
