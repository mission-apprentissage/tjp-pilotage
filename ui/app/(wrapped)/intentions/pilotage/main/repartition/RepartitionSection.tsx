import { Flex } from "@chakra-ui/react";

import type { DisplayTypeEnum } from "@/app/(wrapped)/intentions/pilotage/main/displayTypeEnum";
import type {
  FiltersPilotageIntentions,
  OrderPilotageIntentions,
  RepartitionPilotageIntentions,
} from "@/app/(wrapped)/intentions/pilotage/types";

import { AnalyseComparativeSection } from "./AnalyseComparative/AnalyseComparativeSection";
import { FiliereNiveauDiplomeSection } from "./FiliereNiveauDiplomeSection";

export const RepartitionSection = ({
  repartition,
  order,
  setSearchParams,
  filters,
  displayType,
  displayZonesGeographiques,
  displayDomaines,
}: {
  repartition?: RepartitionPilotageIntentions;
  order: Partial<OrderPilotageIntentions>;
  setSearchParams: (params: { order?: Partial<OrderPilotageIntentions> }) => void;
  filters?: Partial<FiltersPilotageIntentions>;
  displayType: DisplayTypeEnum;
  displayZonesGeographiques: () => void;
  displayDomaines: () => void;
}) => {
  return (
    <Flex direction={"column"} gap={8} w={"100%"}>
      <FiliereNiveauDiplomeSection repartition={repartition} />
      <AnalyseComparativeSection
        zonesGeographiques={repartition?.zonesGeographiques}
        domaines={repartition?.domaines}
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
