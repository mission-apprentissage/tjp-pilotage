import { Box, Flex, Select, Skeleton, Text } from "@chakra-ui/react";

import { BarGraph } from "../components/BarGraph";
import { IndicateurType, PilotageReformeStats } from "../types";

export const EvolutionIndicateursClesSection = ({
  data,
  isLoading,
  isFiltered = false,
  codeRegion,
  indicateur,
  handleIndicateurChange,
  indicateurOptions,
}: {
  data?: PilotageReformeStats;
  isLoading: boolean;
  isFiltered?: boolean | string;
  codeRegion?: string;
  indicateur: IndicateurType;
  handleIndicateurChange: (indicateur: string) => void;
  indicateurOptions: { label: string; value: string; isDefault: boolean }[];
}) => {
  const graphData = {
    anneeN: {
      libelleAnnee: "2021",
      filtered: data?.anneeN.filtered[indicateur],
      nationale: data?.anneeN.nationale[indicateur],
    },
    anneeNMoins1: {
      libelleAnnee: "2020",
      filtered: data?.anneeNMoins1.filtered[indicateur],
      nationale: data?.anneeNMoins1.nationale[indicateur],
    },
  };

  const getLibelleRegion = (
    regions?: Array<{ label: string; value: string }>,
    codeRegion?: string
  ) => {
    return regions?.filter((region) => region.value === codeRegion)[0].label;
  };

  const libelleRegion = isFiltered
    ? getLibelleRegion(data?.filters?.regions, codeRegion)
    : "";

  return (
    <Box
      borderRadius={4}
      border={"1px solid"}
      borderColor="grey.900"
      p={3}
      height={"400"}
      mt={8}
    >
      {isLoading ? (
        <Skeleton opacity="0.3" height="100%" />
      ) : (
        <Box>
          <Flex marginStart={"auto"} justifyContent="space-between">
            <Text color={"bluefrance.113"} fontWeight={700}>
              ÉVOLUTION DES INDICATEURS CLÉS
            </Text>
            <Select
              width="52"
              size="sm"
              variant="input"
              onChange={(e) => handleIndicateurChange(e.target.value)}
              value={indicateur}
            >
              {indicateurOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label.toUpperCase()}
                </option>
              ))}
            </Select>
          </Flex>
          <BarGraph
            graphData={graphData}
            isFiltered={isFiltered}
            libelleRegion={libelleRegion}
          />
        </Box>
      )}
    </Box>
  );
};
