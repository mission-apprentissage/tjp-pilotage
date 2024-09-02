import { Flex, Text } from "@chakra-ui/react";

import { RepartitionPilotageIntentions } from "@/app/(wrapped)/intentions/pilotage-refonte/types";

import { FiltersStatsPilotageIntentions } from "../types";
import { DisplayTypeEnum } from "./displayTypeEnum";
import { RepartitionSection } from "./repartition/RepartitionSection";
import { TabsSection } from "./TabsSection";

export const MainSection = ({
  filters,
  displayType,
  displayRepartition,
  displayQuadrant,
  repartitionData,
}: {
  filters: FiltersStatsPilotageIntentions;
  displayType: DisplayTypeEnum;
  displayRepartition: () => void;
  displayQuadrant: () => void;
  repartitionData?: RepartitionPilotageIntentions;
}) => {
  return (
    <Flex direction="column" w={"100%"} mb={16}>
      <TabsSection
        displayType={displayType}
        displayRepartition={displayRepartition}
        displayQuadrant={displayQuadrant}
      />
      <Flex
        p={8}
        bgColor={"white"}
        borderBottomRadius={4}
        borderTopRightRadius={4}
        minH={500}
        borderLeftWidth={1}
      >
        {displayType === DisplayTypeEnum.repartition ? (
          <RepartitionSection repartitionData={repartitionData} />
        ) : displayType === DisplayTypeEnum.quadrant ? (
          <Text>quadrant</Text>
        ) : null}
      </Flex>
    </Flex>
  );
};
