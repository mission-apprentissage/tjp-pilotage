import { chakra, Flex, Skeleton } from "@chakra-ui/react";

import type {FiltersPilotage, FormationsPilotage, OrderFormationsPilotage, OrderPilotage, Pilotage, StatsSortiePilotage} from '@/app/(wrapped)/demandes/pilotage/types';

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
  formations,
  statsSortie,
  filters,
  setFilters,
  order,
  orderFormations,
  setOrder,
  setOrderFormations,
  isLoading,
}: {
  displayTypes: Array<DisplayTypeEnum>;
  displayRepartition: () => void;
  displayQuadrant: () => void;
  displayZonesGeographiques: () => void;
  displayDomaines: () => void;
  data?: Pilotage;
  formations?: FormationsPilotage;
  statsSortie?: StatsSortiePilotage;
  filters: FiltersPilotage;
  setFilters: (filters: FiltersPilotage) => void;
  order: Partial<OrderPilotage>;
  orderFormations: Partial<OrderFormationsPilotage>;
  setOrder: (order: OrderPilotage) => void;
  setOrderFormations: (orderFormations: OrderFormationsPilotage) => void;
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
          {tabsDisplayType === DisplayTypeEnum.repartition && (
            <RepartitionSection
              data={data}
              order={order}
              setOrder={setOrder}
              filters={filters}
              displayType={analyseComparativeDisplayType}
              displayZonesGeographiques={displayZonesGeographiques}
              displayDomaines={displayDomaines}
            />
          )}
          {tabsDisplayType === DisplayTypeEnum.quadrant && (
            <QuadrantSection
              filters={filters}
              filtersOptions={data?.filters}
              setFilters={setFilters}
              setOrderFormations={setOrderFormations}
              orderFormations={orderFormations}
              data={data}
              formations={formations}
              statsSortie={statsSortie}
            />
          )}
        </Flex>
      )}
    </Flex>
  );
};
