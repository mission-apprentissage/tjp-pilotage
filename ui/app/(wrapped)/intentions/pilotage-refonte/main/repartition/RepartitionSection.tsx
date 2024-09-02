import { Flex } from "@chakra-ui/react";

import { RepartitionPilotageIntentions } from "../../types";
import { AnalyseComparativeSection } from "./AnalyseComparativeSection";
import { FiliereNiveauDiplomeSection } from "./FiliereNiveauDiplomeSection";

export const RepartitionSection = ({
  repartitionData,
}: {
  repartitionData?: RepartitionPilotageIntentions;
}) => {
  return (
    <Flex direction={"column"} gap={8} w={"100%"}>
      <FiliereNiveauDiplomeSection repartitionData={repartitionData} />
      <AnalyseComparativeSection
        zonesGeographiques={repartitionData?.zonesGeographiques}
        domaines={repartitionData?.domaines}
      />
    </Flex>
  );
};
