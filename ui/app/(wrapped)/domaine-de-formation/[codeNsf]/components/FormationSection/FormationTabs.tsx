import { Button, Flex, Tab, TabList, Tabs, Text } from "@chakra-ui/react";
import { Icon } from "@iconify/react";

import { FormationTab } from "../../types";

export const FormationTabs = ({
  selectedTab,
  changeTab,
}: {
  selectedTab: FormationTab;
  changeTab: (tab: FormationTab) => void;
}) => {
  return (
    <Tabs
      isLazy={true}
      index={
        {
          etablissements: 0,
          tableauComparatif: 1,
          indicateurs: 2,
        }[selectedTab]
      }
      display="flex"
      flexDirection="column"
      variant="blue-border"
      minHeight="0"
      w={"fit-content"}
    >
      <TabList>
        <Tab as={Button} onClick={() => changeTab("etablissements")} isDisabled>
          <Flex
            direction={"row"}
            justify={"center"}
            alignItems={"center"}
            p={3}
            gap={2}
          >
            <Icon icon="ri:map-pin-line" height={"16px"} width={"16px"} />
            <Text>Etablissements</Text>
          </Flex>
        </Tab>
        <Tab
          as={Button}
          onClick={() => changeTab("tableauComparatif")}
          isDisabled
        >
          <Flex
            direction={"row"}
            justify={"center"}
            alignItems={"center"}
            p={3}
            gap={2}
          >
            <Icon icon="ri:table-2" height={"16px"} width={"16px"} />
            <Text>Tableau comparatif</Text>
          </Flex>
        </Tab>
        <Tab as={Button} onClick={() => changeTab("indicateurs")}>
          <Flex
            direction={"row"}
            justify={"center"}
            alignItems={"center"}
            p={3}
            gap={2}
          >
            <Icon icon="ri:bar-chart-2-line" height={"16px"} width={"16px"} />
            <Text>Indicateurs</Text>
          </Flex>
        </Tab>
      </TabList>
    </Tabs>
  );
};
