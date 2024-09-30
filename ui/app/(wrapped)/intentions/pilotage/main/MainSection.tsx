import { Flex } from "@chakra-ui/react";

import { useScopeCode } from "../hooks";
import {
  FiltersStatsPilotageIntentions,
  OrderRepartitionPilotageIntentions,
  RepartitionPilotageIntentions,
  StatsPilotageIntentions,
} from "../types";
import { DisplayTypeEnum } from "./displayTypeEnum";
import { QuadrantSection } from "./quadrant/QuadrantSection";
import { RepartitionSection } from "./repartition/RepartitionSection";
import { TabsSection } from "./TabsSection";

export const MainSection = ({
  displayTypes,
  displayRepartition,
  displayQuadrant,
  displayZonesGeographiques,
  displayDomaines,
  quadrantData,
  repartitionData,
  filters,
  order,
  setSearchParams,
}: {
  displayTypes: Array<DisplayTypeEnum>;
  displayRepartition: () => void;
  displayQuadrant: () => void;
  displayZonesGeographiques: () => void;
  displayDomaines: () => void;
  quadrantData?: StatsPilotageIntentions;
  repartitionData?: RepartitionPilotageIntentions;
  filters: FiltersStatsPilotageIntentions;
  order: Partial<OrderRepartitionPilotageIntentions>;
  setSearchParams: (params: {
    order?: Partial<OrderRepartitionPilotageIntentions>;
  }) => void;
}) => {
  const tabsDisplayType = displayTypes[0];
  const analyseComparativeDisplayType = displayTypes[1];

  return (
    <Flex direction="column" w={"100%"} mb={16}>
      <TabsSection
        displayType={tabsDisplayType}
        displayRepartition={displayRepartition}
        displayQuadrant={displayQuadrant}
      />
      <Flex
        p={8}
        bgColor={"white"}
        borderBottomRadius={4}
        borderTopRightRadius={4}
        borderLeftWidth={1}
      >
        {tabsDisplayType === DisplayTypeEnum.repartition ? (
          <RepartitionSection
            repartitionData={repartitionData}
            order={order}
            setSearchParams={setSearchParams}
            filters={filters}
            displayType={analyseComparativeDisplayType}
            displayZonesGeographiques={displayZonesGeographiques}
            displayDomaines={displayDomaines}
          />
        ) : tabsDisplayType === DisplayTypeEnum.quadrant ? (
          <>
            <QuadrantSection
              parentFilters={filters}
              scopeFilters={quadrantData?.filters}
              scope={{
                type: filters.scope,
                value: useScopeCode(filters).code,
              }}
              repartitionData={repartitionData}
            />
          </>
        ) : null}
      </Flex>
    </Flex>
  );
};
