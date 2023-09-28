import { Box, Flex, Select, Skeleton, Text } from "@chakra-ui/react";

import { CartoGraph } from "../components/CartoGraph";
import { IndicateurType, PilotageReformeStatsRegion } from "../types";

export const CartoSection = ({
  data,
  isLoading,
  indicateur,
  handleIndicateurChange,
  indicateurOptions,
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
}) => {
  const graphData = data?.statsRegions.map((region) => {
    return {
      codeRegion: region.codeRegion,
      libelleRegion: region.libelleRegion,
      insertion: region.insertion ?? 0,
      poursuite: region.poursuite ?? 0,
    };
  });

  return (
    <Box
      borderRadius={4}
      border={"1px solid"}
      borderColor="grey.900"
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
          <CartoGraph graphData={graphData} indicateur={indicateur} />
        </Box>
      )}
    </Box>
  );
};
