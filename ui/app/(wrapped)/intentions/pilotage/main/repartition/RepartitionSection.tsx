import { Flex } from "@chakra-ui/react";

import {
  FiltersStatsPilotageIntentions,
  OrderRepartitionPilotageIntentions,
} from "@/app/(wrapped)/intentions/pilotage/types";

import { RepartitionPilotageIntentions } from "../../types";
import { AnalyseComparativeSection } from "./AnalyseComparativeSection";
import { FiliereNiveauDiplomeSection } from "./FiliereNiveauDiplomeSection";

export const RepartitionSection = ({
  repartitionData,
  order,
  setSearchParams,
  filters,
}: {
  repartitionData?: RepartitionPilotageIntentions;
  order: Partial<OrderRepartitionPilotageIntentions>;
  setSearchParams: (params: {
    order?: Partial<OrderRepartitionPilotageIntentions>;
  }) => void;
  filters?: Partial<FiltersStatsPilotageIntentions>;
}) => {
  return (
    <Flex direction={"column"} gap={8} w={"100%"}>
      <FiliereNiveauDiplomeSection repartitionData={repartitionData} />
      <AnalyseComparativeSection
        zonesGeographiques={repartitionData?.zonesGeographiques}
        domaines={repartitionData?.domaines}
        order={order}
        setSearchParams={setSearchParams}
        filters={filters}
      />
    </Flex>
  );
};
