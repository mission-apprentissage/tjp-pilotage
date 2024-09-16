import { Flex } from "@chakra-ui/react";

import { DisplayTypeEnum } from "@/app/(wrapped)/intentions/pilotage/main/displayTypeEnum";
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
}: {
  repartitionData?: RepartitionPilotageIntentions;
  order: Partial<OrderRepartitionPilotageIntentions>;
  setSearchParams: (params: {
    displayType?: DisplayTypeEnum;
    filters?: Partial<FiltersStatsPilotageIntentions>;
    order?: Partial<OrderRepartitionPilotageIntentions>;
  }) => void;
}) => {
  return (
    <Flex direction={"column"} gap={8} w={"100%"}>
      <FiliereNiveauDiplomeSection repartitionData={repartitionData} />
      <AnalyseComparativeSection
        zonesGeographiques={repartitionData?.zonesGeographiques}
        domaines={repartitionData?.domaines}
        order={order}
        setSearchParams={setSearchParams}
      />
    </Flex>
  );
};
