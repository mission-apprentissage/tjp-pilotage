import {
  Button,
  Flex,
  Tab,
  TabList,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";

import { Filters, TabFiltres } from "./TabFiltres";
import { TabInformations } from "./TabInformations";

enum QuadrantTabsEnum {
  filtres = 0,
  informations = 1,
}

export const QuadrantTabs = ({
  filters,
  setFilters,
}: {
  filters: Filters;
  setFilters: (filters: Filters) => void;
}) => {
  const [tabIndex, setTabIndex] = useState(QuadrantTabsEnum.filtres);
  return (
    <Tabs
      isLazy={true}
      index={tabIndex}
      display="flex"
      flex="1"
      flexDirection="column"
      variant="blue-border"
      minHeight="0"
      width={"100%"}
      onChange={(i) => setTabIndex(i)}
    >
      <TabList>
        <Tab as={Button}>
          <Flex
            direction={"row"}
            justify={"center"}
            alignItems={"center"}
            p={3}
            gap={2}
          >
            <Icon icon="ri:filter-line" />
            <Text>Filtres</Text>
          </Flex>
        </Tab>
        <Tab as={Button}>
          <Flex
            direction={"row"}
            justify={"center"}
            alignItems={"center"}
            p={3}
            gap={2}
          >
            <Icon icon="ri:question-line" />
            <Text>Comprendre le quadrant</Text>
          </Flex>
        </Tab>
      </TabList>
      <TabPanels>
        <TabFiltres filters={filters} setFilters={setFilters} />
        <TabInformations />
      </TabPanels>
    </Tabs>
  );
};
