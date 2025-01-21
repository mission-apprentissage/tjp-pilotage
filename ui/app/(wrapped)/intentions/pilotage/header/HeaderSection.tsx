import { Flex, Heading, VStack } from "@chakra-ui/react";
import { useState } from "react";

import type {
  FiltersStatsPilotageIntentions,
  FilterTracker,
  StatsPilotageIntentions,
} from "@/app/(wrapped)/intentions/pilotage/types";

import type { IndicateurType } from "./CartoSection";
import { CartoSection } from "./CartoSection";
import { IndicateursClesSection } from "./IndicateursClesSection";

export const HeaderSection = ({
  data,
  filters,
  setFilters,
  onOpenTauxTransfoDefinition,
  filterTracker,
  isLoading,
}: {
  data?: StatsPilotageIntentions;
  filters: FiltersStatsPilotageIntentions;
  setFilters: (filters: FiltersStatsPilotageIntentions) => void;
  onOpenTauxTransfoDefinition: () => void;
  filterTracker: FilterTracker;
  isLoading?: boolean;
}) => {
  const [indicateur, setIndicateur] = useState<IndicateurType>("tauxTransformation");

  const indicateurOptions = [
    {
      label: "Taux de transformation",
      value: "tauxTransformation",
      isDefault: true,
    },
    {
      label: "Ratio de fermetures",
      value: "ratioFermeture",
      isDefault: false,
    },
  ];

  return (
    <VStack gap={8} width="100%" alignItems="start" color={"grey.50"}>
      <Flex direction={"row"} gap={3}>
        <Heading as="h1" fontWeight="700" fontSize="20px" lineHeight="28px">
          Indicateurs clés de la transformation
        </Heading>
      </Flex>
      <Flex direction={"row"} width="100%" h="100%" gap="16px">
        <Flex flex="1" direction={"column"} gap={6}>
          <IndicateursClesSection
            data={data}
            filters={filters}
            isLoading={isLoading}
            onOpenTauxTransfoDefinition={onOpenTauxTransfoDefinition}
          />
        </Flex>
        <Flex flex={1} minW={500} minH={500}>
          <CartoSection
            indicateur={indicateur}
            handleIndicateurChange={(newIndicateur) => setIndicateur(newIndicateur as IndicateurType)}
            indicateurOptions={indicateurOptions}
            filters={filters}
            data={data}
            handleFilters={(f) => setFilters({ ...filters, ...f })}
            filterTracker={filterTracker}
            isLoading={isLoading}
          />
        </Flex>
      </Flex>
    </VStack>
  );
};
