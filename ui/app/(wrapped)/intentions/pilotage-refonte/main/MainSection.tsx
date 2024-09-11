import { Flex } from "@chakra-ui/react";

import { QuadrantSection } from "../components/QuadrantSection";
import { useScopeCode } from "../hooks";
import {
  FiltersStatsPilotageIntentions,
  OrderRepartitionPilotageIntentions,
  RepartitionPilotageIntentions,
  StatsPilotageIntentions,
} from "../types";
import { DisplayTypeEnum } from "./displayTypeEnum";
import { RepartitionSection } from "./repartition/RepartitionSection";
import { TabsSection } from "./TabsSection";

export const MainSection = ({
  displayType,
  displayRepartition,
  displayQuadrant,
  quadrantData,
  repartitionData,
  filters,
  order,
  setSearchParams,
}: {
  displayType: DisplayTypeEnum;
  displayRepartition: () => void;
  displayQuadrant: () => void;
  quadrantData?: StatsPilotageIntentions;
  repartitionData?: RepartitionPilotageIntentions;
  filters: FiltersStatsPilotageIntentions;
  order: Partial<OrderRepartitionPilotageIntentions>;
  setSearchParams: (params: {
    displayType?: DisplayTypeEnum;
    filters?: Partial<FiltersStatsPilotageIntentions>;
    order?: Partial<OrderRepartitionPilotageIntentions>;
  }) => void;
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
        borderLeftWidth={1}
      >
        {displayType === DisplayTypeEnum.repartition ? (
          <RepartitionSection
            repartitionData={repartitionData}
            order={order}
            setSearchParams={setSearchParams}
          />
        ) : displayType === DisplayTypeEnum.quadrant ? (
          <>
            <QuadrantSection
              parentFilters={filters}
              scopeFilters={quadrantData?.filters}
              scope={{
                type: filters.scope,
                value: useScopeCode(filters).code,
              }}
            />
          </>
        ) : null}
      </Flex>
    </Flex>
  );
};
