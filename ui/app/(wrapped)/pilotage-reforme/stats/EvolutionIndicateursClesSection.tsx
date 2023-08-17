import { Box, Flex, Select, Skeleton, Text } from "@chakra-ui/react";
import { useState } from "react";

import { BarGraph } from "../components/BarGraph";
import { PilotageReformeStats } from "../types";

export const EvolutionIndicateursClesSection = ({
  data,
  isLoading,
  isFiltered = false,
  codeRegion,
}: {
  data?: PilotageReformeStats;
  isLoading: boolean;
  isFiltered?: boolean | string;
  codeRegion?: string;
}) => {
  const indicateurOptions = [
    {
      label: "Taux d'insertion",
      value: "tauxInsertion6mois",
      isDefault: true,
    },
    {
      label: "Taux de poursuite d'études",
      value: "tauxPoursuiteEtudes",
      isDefault: false,
    },
  ];

  const [indicateur, setIndicateur] = useState<
    "tauxInsertion6mois" | "tauxPoursuiteEtudes"
  >("tauxInsertion6mois");

  const onSelectIndicateurChange = (indicateur: string): void => {
    if (
      indicateur === "tauxInsertion6mois" ||
      indicateur === "tauxPoursuiteEtudes"
    )
      setIndicateur(indicateur);
  };

  const graphData = {
    anneePrecedente: {
      libelleAnnee: "2021",
      filtered: data?.anneePrecedente.filtered[indicateur],
      nationale: data?.anneePrecedente.nationale[indicateur],
    },
    anneeEnCours: {
      libelleAnnee: "2022",
      filtered: data?.anneeEnCours.filtered[indicateur],
      nationale: data?.anneeEnCours.nationale[indicateur],
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
      p={4}
      height={"400"}
    >
      {isLoading ? (
        <Skeleton opacity="0.3" height="100%" />
      ) : (
        <Box mx={5} border={""}>
          <Flex marginStart={"auto"} justifyContent="space-between">
            <Text color={"bluefrance.113"} fontWeight={700}>
              ÉVOLUTION DES INDICATEURS CLÉS
            </Text>
            <Select
              width="52"
              size="sm"
              variant="input"
              onChange={(e) => onSelectIndicateurChange(e.target.value)}
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
