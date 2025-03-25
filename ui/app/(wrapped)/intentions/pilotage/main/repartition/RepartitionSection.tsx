import { Flex } from "@chakra-ui/react";

import type { DisplayTypeEnum } from "@/app/(wrapped)/intentions/pilotage/main/displayTypeEnum";
import type {
  FiltersPilotageIntentions,
  OrderPilotageIntentions,
  PilotageIntentions,
} from "@/app/(wrapped)/intentions/pilotage/types";

import { AnalyseComparativeSection } from "./AnalyseComparative/AnalyseComparativeSection";
import { FiliereNiveauDiplomeSection } from "./FiliereNiveauDiplomeSection";

export const RepartitionSection = ({
  data,
  order,
  setOrder,
  filters,
  displayType,
  displayZonesGeographiques,
  displayDomaines,
}: {
  data?: PilotageIntentions;
  order: Partial<OrderPilotageIntentions>;
  setOrder: (order: OrderPilotageIntentions) => void;
  filters?: Partial<FiltersPilotageIntentions>;
  displayType: DisplayTypeEnum;
  displayZonesGeographiques: () => void;
  displayDomaines: () => void;
}) => {
  return (
    <Flex direction={"column"} gap={8} w={"100%"}>
      <FiliereNiveauDiplomeSection data={data} />
      <AnalyseComparativeSection
        zonesGeographiques={data?.zonesGeographiques}
        domaines={data?.domaines}
        order={order}
        setOrder={setOrder}
        filters={filters}
        displayType={displayType}
        displayZonesGeographiques={displayZonesGeographiques}
        displayDomaines={displayDomaines}
      />
    </Flex>
  );
};
