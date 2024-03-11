import { Box, Text } from "@chakra-ui/react";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { TooltipIcon } from "@/components/TooltipIcon";

import { DashboardCard } from "../../../DashboardCard";
import { CounterChart } from "../../components/CounterChart";
import { VerticalBarChart } from "../../components/VerticalBarChart";
import { formatMillesime, formatTaux } from "../../formatData";
import { ChiffresIJOffre } from "../../types";

export const TauxEmploi = ({
  chiffresIJOffre,
}: {
  chiffresIJOffre?: ChiffresIJOffre;
}) => {
  const { openGlossaire } = useGlossaireContext();
  const checkDataAvailability = (chiffresIJOffre: ChiffresIJOffre) => {
    return (
      Object.values(chiffresIJOffre).findIndex(
        (value) => value.tauxInsertion
      ) !== -1
    );
  };
  return (
    <DashboardCard
      label="Taux d'emploi à 6 mois"
      tooltip={
        <TooltipIcon
          ml="1"
          label={
            <Box>
              <Text>
                La part de ceux qui sont en emploi 6 mois après leur sortie
                d’étude.
              </Text>
              <Text>Cliquez pour plus d'infos.</Text>
            </Box>
          }
          onClick={() => openGlossaire("taux-emploi-6-mois")}
        />
      }
    >
      {chiffresIJOffre && checkDataAvailability(chiffresIJOffre) ? (
        <VerticalBarChart
          data={Object.keys(chiffresIJOffre)
            .filter((millesime) => chiffresIJOffre[millesime].tauxInsertion)
            .map((millesime) => ({
              label: formatMillesime(millesime),
              value: formatTaux(chiffresIJOffre[millesime].tauxInsertion),
            }))}
        />
      ) : (
        <CounterChart />
      )}
    </DashboardCard>
  );
};