import { chakra, Flex, Skeleton } from "@chakra-ui/react";

import { useScopeCode } from "@/app/(wrapped)/intentions/pilotage/hooks";
import type {
  FiltersPilotageIntentions,
  OrderPilotageIntentions,
  OrderQuadrantPilotageIntentions,
  PilotageIntentions,
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
  data,
  filters,
  order,
  orderQuadrant,
  setFilters,
  setSearchParams,
  isLoading,
}: {
  displayTypes: Array<DisplayTypeEnum>;
  displayRepartition: () => void;
  displayQuadrant: () => void;
  displayZonesGeographiques: () => void;
  displayDomaines: () => void;
  data?: PilotageIntentions;
  filters: FiltersPilotageIntentions;
  order: Partial<OrderPilotageIntentions>;
  orderQuadrant: Partial<OrderQuadrantPilotageIntentions>;
  setFilters: (filters: FiltersPilotageIntentions) => void;
  setSearchParams: (params: {
    order?: Partial<OrderPilotageIntentions>;
    orderQuadrant?: Partial<OrderQuadrantPilotageIntentions>;
  }) => void;
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
              filters={filters}
              setSearchParams={setSearchParams}
              order={order}
              displayType={analyseComparativeDisplayType}
              displayZonesGeographiques={displayZonesGeographiques}
              displayDomaines={displayDomaines}
              repartition={data?.repartition}
            />
          ) : tabsDisplayType === DisplayTypeEnum.quadrant ? (
            <QuadrantSection
              filters={filters}
              filtersOptions={data?.filtersOptions}
              setFilters={setFilters}
              setSearchParams={setSearchParams}
              orderQuadrant={orderQuadrant}
              scope={{
                type: filters.scope,
                // eslint-disable-next-line react-hooks/rules-of-hooks
                value: useScopeCode(filters).code, // TODO
              }}
              {...data}
            />
          ) : null}
        </Flex>
      )}
    </Flex>
  );
};
