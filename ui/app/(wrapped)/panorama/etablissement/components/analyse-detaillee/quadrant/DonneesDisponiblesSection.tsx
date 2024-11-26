import { Box, Flex, Text } from "@chakra-ui/react";
import { CURRENT_RENTREE } from "shared";

import type {
  ChiffresEntree,
  Formation,
} from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/types";

import { ProgressBar } from "./ProgressBar";

export const DonneesDisponiblesSection = ({
  formations,
  filteredFormations,
  chiffresEntree,
}: {
  formations: Formation[];
  filteredFormations: (Formation & {
    effectif?: number;
  })[];
  chiffresEntree?: ChiffresEntree;
}) => {
  const getEffectifsPercentage = () => {
    const percentage =
      ((filteredFormations?.reduce((acc, formation) => acc + (formation?.effectif ?? 0), 0) ?? 0) /
        (formations?.reduce(
          (acc, formation) => acc + (chiffresEntree?.[formation.offre]?.[CURRENT_RENTREE]?.effectifEntree ?? 0),
          0
        ) ?? 0)) *
      100;

    return Number.isNaN(percentage) ? 0 : percentage;
  };

  return (
    <Flex
      direction={"column"}
      gap={8}
      borderWidth={"1px"}
      borderColor={"grey.925"}
      borderRadius={"4px"}
      py={"16px"}
      px={"24px"}
    >
      <Text fontSize={14} fontWeight={700}>
        Données disponibles pour l'établissement
      </Text>
      <Box>
        <ProgressBar
          percentage={((filteredFormations?.length ?? 0) / formations.length) * 100}
          leftLabel={"Formations"}
          rightLabel={`${filteredFormations?.length ?? 0} / ${formations.length}`}
        />
      </Box>
      <Box>
        <ProgressBar
          percentage={getEffectifsPercentage()}
          leftLabel={"Effectifs"}
          rightLabel={`${
            filteredFormations?.reduce((acc, formation) => acc + (formation?.effectif ?? 0), 0) ?? "-"
          } / ${
            formations?.reduce(
              (acc, formation) => acc + (chiffresEntree?.[formation.offre]?.[CURRENT_RENTREE]?.effectifEntree ?? 0),
              0
            ) ?? "-"
          }`}
        />
      </Box>
    </Flex>
  );
};
