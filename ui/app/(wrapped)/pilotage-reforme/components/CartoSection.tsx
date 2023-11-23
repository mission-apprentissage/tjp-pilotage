import { Box, Flex, Select, Skeleton, Text } from "@chakra-ui/react";

import { CartoGraph } from "../../../../components/CartoGraph";
import { Filters, IndicateurType, PilotageReformeStatsRegion } from "../types";

export const CartoSection = ({
  data,
  isLoading,
  indicateur,
  handleIndicateurChange,
  indicateurOptions,
  activeFilters,
  handleFilters,
}: {
  data?: PilotageReformeStatsRegion;
  isLoading: boolean;
  indicateur: IndicateurType;
  handleIndicateurChange: (indicateur: string) => void;
  indicateurOptions: {
    label: string;
    value: string;
    isDefault: boolean;
  }[];
  activeFilters: Filters;
  handleFilters: (type: keyof Filters, value: Filters[keyof Filters]) => void;
}) => {
  const graphData = data?.statsRegions.map((region) => {
    return {
      name: region.libelleRegion,
      value: Math.round(region[indicateur] ?? 0),
    };
  });

  const handleClickOnRegion = (codeRegion: string | undefined) => {
    if (activeFilters.codeRegion && activeFilters.codeRegion === codeRegion)
      handleFilters("codeRegion", undefined);
    else handleFilters("codeRegion", codeRegion);
  };

  return (
    <Box
      borderRadius={4}
      border={"1px solid"}
      borderColor="grey.900"
      bg="white"
      p={3}
      height={"601"}
      mt={12}
    >
      {isLoading ? (
        <Skeleton opacity="0.3" height="100%" />
      ) : (
        <Box>
          <Flex marginStart={"auto"} justifyContent="space-between">
            <Text color={"bluefrance.113"} fontWeight={700}>
              VISUALISATION TERRITORIALE
            </Text>
            <Select
              width="64"
              size="sm"
              variant="newInput"
              bg={"grey.150"}
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
          <CartoGraph graphData={graphData} handleClick={handleClickOnRegion} />
        </Box>
      )}
    </Box>
  );
};
