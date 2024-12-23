import { Button, Flex, Tab, TabList, Tabs, Text } from "@chakra-ui/react";
import { Icon } from "@iconify/react";

import type { FormationTab } from "@/app/(wrapped)/domaine-de-formation/[codeNsf]/types";

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
          indicateurs: 1,
          tableauComparatif: 2,
        }[selectedTab]
      }
      display="flex"
      flexDirection="column"
      variant="blue-border"
      minHeight="0"
      w={"fit-content"}
      borderColor={"grey.900"}
    >
      <TabList>
        <Tab as={Button} onClick={() => changeTab("etablissements")}>
          <Flex direction={"row"} justify={"center"} alignItems={"center"} p={3} gap={2}>
            <Icon icon="ri:map-pin-line" height={"16px"} width={"16px"} />
            <Text>Etablissements</Text>
          </Flex>
        </Tab>
        <Tab as={Button} onClick={() => changeTab("indicateurs")}>
          <Flex direction={"row"} justify={"center"} alignItems={"center"} p={3} gap={2}>
            <Icon icon="ri:bar-chart-2-line" height={"16px"} width={"16px"} />
            <Text>Indicateurs</Text>
          </Flex>
        </Tab>
      </TabList>
    </Tabs>
  );
};
