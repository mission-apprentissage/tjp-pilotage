import { Badge, Box, Text } from "@chakra-ui/react";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { TooltipIcon } from "@/components/TooltipIcon";

import { DashboardCard } from "../../../DashboardCard";
import { CounterChart } from "../../components/CounterChart";

export const Effectifs = ({
  effectifEntree,
  capacite,
}: {
  effectifEntree?: number;
  capacite?: number;
}) => {
  const { openGlossaire } = useGlossaireContext();
  const getCompareData = () => {
    if (!effectifEntree || !capacite) return "";
    if (capacite > effectifEntree) {
      return (
        <Text fontWeight={"bold"} color="warning.525">
          {`${capacite - effectifEntree} pl. vacante(s)`}
        </Text>
      );
    } else if (capacite < effectifEntree) {
      return (
        <Text fontWeight={"bold"} color={"success.425"}>
          {`${effectifEntree - capacite} pl. en surnombre`}
        </Text>
      );
    }
    return (
      <Text fontWeight={"bold"} color="grey.625">
        0 pl. vacante
      </Text>
    );
  };
  return (
    <DashboardCard
      label="Effectifs en entrée (Constat Rentrée 2023)"
      tooltip={
        <TooltipIcon
          ml="1"
          label={
            <Box>
              <Text>Effectifs en entrée en première année de formation.</Text>
              <Text>Cliquez pour plus d'infos.</Text>
            </Box>
          }
          onClick={() => openGlossaire("effectif-en-entree")}
        />
      }
      badge={
        <Badge variant="lavander" size={"xs"}>
          Étab.
        </Badge>
      }
    >
      <CounterChart data={effectifEntree} compareData={getCompareData()} />
    </DashboardCard>
  );
};
