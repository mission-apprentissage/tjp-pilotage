import { Box, Flex, Select, Skeleton, Text } from "@chakra-ui/react";

import { CartoGraph } from "../components/CartoGraph";
import { PilotageReformeStatsRegion } from "../types";

export const CartoSection = ({
  data,
  isLoading,
  indicateur,
  handleIndicateurChange,
  indicateurOptions,
}: {
  data?: PilotageReformeStatsRegion;
  isLoading: boolean;
  indicateur: "tauxInsertion6mois" | "tauxPoursuiteEtudes" | "tauxDecrochage";
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
      tauxInsertion6mois: region.tauxInsertion6mois ?? 0,
      tauxPoursuiteEtudes: region.tauxPoursuiteEtudes ?? 0,
      tauxDecrochage: region.tauxDecrochage ?? 0,
    };
  });

  return (
    <Box
      borderRadius={4}
      border={"1px solid"}
      borderColor="grey.900"
      p={4}
      height={"650"}
    >
      {isLoading ? (
        <Skeleton opacity="0.3" height="100%" />
      ) : (
        <Box mx={5} border={""}>
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
