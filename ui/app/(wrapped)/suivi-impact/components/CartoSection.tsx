import { Box, Flex, Heading, Select, Skeleton, VisuallyHidden } from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";

import type { Filters, IndicateurOption, IndicateurType, PilotageReformeStatsRegion, PilotageReformeStatsRegionData } from "@/app/(wrapped)/suivi-impact/types";
import { CartoGraph } from "@/components/CartoGraph";
import { formatNumber } from "@/utils/formatUtils";

interface CartoSelectionProps {
  data?: PilotageReformeStatsRegion;
  isLoading: boolean;
  activeFilters: Filters;
  handleFilters: (type: keyof Filters, value: Filters[keyof Filters]) => void;
}

const getCustomPalette = (indicateur: IndicateurType) : number[][] | undefined => {
  if(indicateur === "tauxTransformationCumule"){
    return [
      [0, 10],
      [10, 15],
      [15, 20],
      [20, 10000],
    ];
  }

  return undefined;
};

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

  const getDataValue = useCallback((region: PilotageReformeStatsRegionData ) => {
    let taux : number | undefined;

    if(indicateur === "tauxTransformationCumule" || indicateur === "tauxTransformationCumulePrevisionnel"){
      taux = region[indicateur]?.taux;
    }
    else {
      taux = region[indicateur];
    }

    return typeof taux === "undefined" ? undefined : formatNumber(taux * 100, 1);
  }, [indicateur]);

  const graphData = useMemo(() => data?.statsRegions.map((region) => {
    return {
      name: region.libelleRegion,
      code: region.codeRegion,
      value: getDataValue(region),
    };
  }), [data, getDataValue]) ;

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
            customPiecesSteps={getCustomPalette(indicateur)}
          />
        </Box>
      )}
    </Box>
  );
};
