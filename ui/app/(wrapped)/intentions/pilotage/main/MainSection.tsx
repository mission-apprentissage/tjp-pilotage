import { chakra, Flex, Skeleton } from "@chakra-ui/react";

import { useScopeCode } from "@/app/(wrapped)/intentions/pilotage/hooks";
import type {
  FiltersStatsPilotageIntentions,
  OrderRepartitionPilotageIntentions,
  RepartitionPilotageIntentions,
  StatsPilotageIntentions,
} from "@/app/(wrapped)/intentions/pilotage/types";

import { DisplayTypeEnum } from "./displayTypeEnum";
import { QuadrantSection } from "./quadrant/QuadrantSection";
import { RepartitionSection } from "./repartition/RepartitionSection";
import { TabsSection } from "./TabsSection";

const Loader = chakra(() => {
  return (
    <Flex
      minH={600}
      gap={6}
      direction={"column"}
      p={8}
      bgColor={"white"}
      borderBottomRadius={4}
      borderTopRightRadius={4}
      borderLeftWidth={1}
    >
      <Skeleton opacity={0.3} h={14} w={"100%"} />
      <Skeleton opacity={0.3} h={300} w={"100%"} />
      <Skeleton opacity={0.3} h={14} w={"100%"} />
      <Skeleton opacity={0.3} h={300} w={"100%"} />
    </Flex>
  );
});

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
  isLoading,
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
  setSearchParams: (params: { order?: Partial<OrderRepartitionPilotageIntentions> }) => void;
  isLoading?: boolean;
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
      {isLoading ? (
        <Loader />
      ) : (
        <Flex p={8} bgColor={"white"} borderBottomRadius={4} borderTopRightRadius={4} borderLeftWidth={1}>
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
            <QuadrantSection
              parentFilters={filters}
              scopeFilters={quadrantData?.filters}
              scope={{
                type: filters.scope,
                // eslint-disable-next-line react-hooks/rules-of-hooks
                value: useScopeCode(filters).code, // TODO
              }}
              repartitionData={repartitionData}
            />
          ) : null}
        </Flex>
      )}
    </Flex>
  );
};
