import { Flex } from "@chakra-ui/react";

import type { DisplayTypeEnum } from "@/app/(wrapped)/intentions/pilotage/main/displayTypeEnum";
import type {
  FiltersStatsPilotageIntentions,
  OrderRepartitionPilotageIntentions,
  RepartitionPilotageIntentions,
} from "@/app/(wrapped)/intentions/pilotage/types";

import { AnalyseComparativeSection } from "./AnalyseComparative/AnalyseComparativeSection";
import { FiliereNiveauDiplomeSection } from "./FiliereNiveauDiplomeSection";

export const RepartitionSection = ({
  repartitionData,
  order,
  setSearchParams,
  filters,
  displayType,
  displayZonesGeographiques,
  displayDomaines,
}: {
  repartitionData?: RepartitionPilotageIntentions;
  order: Partial<OrderRepartitionPilotageIntentions>;
  setSearchParams: (params: { order?: Partial<OrderRepartitionPilotageIntentions> }) => void;
  filters?: Partial<FiltersStatsPilotageIntentions>;
  displayType: DisplayTypeEnum;
  displayZonesGeographiques: () => void;
  displayDomaines: () => void;
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
        displayType={displayType}
        displayZonesGeographiques={displayZonesGeographiques}
        displayDomaines={displayDomaines}
      />
    </Flex>
  );
};
