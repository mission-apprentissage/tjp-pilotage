import { Box, Flex, Heading, Select, Skeleton, VisuallyHidden } from "@chakra-ui/react";
import { useMemo, useState } from "react";

import type { Filters, IndicateurOption, IndicateurType, PilotageReformeStatsRegion } from "@/app/(wrapped)/pilotage-reforme/types";
import { CartoGraph } from "@/components/CartoGraph";
import { formatNumber } from "@/utils/formatUtils";

interface CartoSelectionProps {
  data?: PilotageReformeStatsRegion;
  isLoading: boolean;
  activeFilters: Filters;
  handleFilters: (type: keyof Filters, value: Filters[keyof Filters]) => void;
}

export const CartoSection = ({
  data,
  isLoading,
  activeFilters,
  handleFilters,
}: CartoSelectionProps) => {

  const [indicateur, setIndicateur] = useState<IndicateurType>("tauxInsertion");
  const indicateurOptions: IndicateurOption[] = [
    {
      label: "Taux d'emploi à 6 mois",
      value: "tauxInsertion",
      isDefault: true,
    },
    {
      label: "Taux de poursuite d'études",
      value: "tauxPoursuite",
      isDefault: false,
    },
    {
      label: "Taux de transformation cumulé",
      value: "tauxTransformationCumule",
      isDefault: false,
    },
    {
      label: "Taux de chômage",
      value: "tauxChomage",
      isDefault: false,
    },
  ];

  const graphData = useMemo(() => data?.statsRegions.map((region) => {
    return {
      name: region.libelleRegion,
      code: region.codeRegion,
      value: formatNumber((region[indicateur] ?? 0) * 100),
    };
  }), [data, indicateur]) ;

  const handleClickOnRegion = (codeRegion: string | undefined) => {
    if (activeFilters.codeRegion && activeFilters.codeRegion === codeRegion) handleFilters("codeRegion", undefined);
    else handleFilters("codeRegion", codeRegion);
  };

  return (
    <Box flex={1} borderRadius={4} border={"1px solid"} borderColor="grey.900" bg="white" p={3} mt={12}>
      {isLoading ? (
        <Skeleton opacity="0.3" height="100%" />
      ) : (
        <Box>
          <Flex marginStart={"auto"} justifyContent="space-between">
            <Heading
              as="h2"
              fontSize={15}
              fontWeight="500"
              textTransform={"uppercase"}
              color={"bluefrance.113"}
            >
            Visualisation territoriale
            </Heading>
            <VisuallyHidden as="label" htmlFor="select-indicateur-carto">Indicateur</VisuallyHidden>
            <Select
              id="select-indicateur-carto"
              width="80"
              size="sm"
              variant="newInput"
              bg={"grey.150"}
              onChange={(e) => setIndicateur(e.target.value as IndicateurType)}
              value={indicateur}
            >
              {indicateurOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label.toUpperCase()}
                </option>
              ))}
            </Select>
          </Flex>
          <CartoGraph
            graphData={graphData}
            handleClick={handleClickOnRegion}
            codeRegionSelectionne={activeFilters.codeRegion}
          />
        </Box>
      )}
    </Box>
  );
};
