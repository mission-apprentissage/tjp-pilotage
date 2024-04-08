import { Badge, Box, Text } from "@chakra-ui/react";

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
  const checkDataAvailability = (): boolean => {
    if (chiffresIJOffre) {
      return (
        Object.values(chiffresIJOffre).findIndex(
          (value) => value.tauxInsertion
        ) !== -1
      );
    }
    return false;
  };

  const getVerticalBarChartData = (): { label: string; value: number }[] => {
    if (chiffresIJOffre) {
      return Object.keys(chiffresIJOffre)
        .filter((millesime) => chiffresIJOffre[millesime].tauxInsertion)
        .map((millesime) => ({
          label: formatMillesime(millesime),
          value: formatTaux(chiffresIJOffre[millesime].tauxInsertion),
        }));
    }
    return [];
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
      badge={
        <Badge variant="lavander" size={"xs"}>
          Étab.
        </Badge>
      }
    >
      {checkDataAvailability() ? (
        <VerticalBarChart data={getVerticalBarChartData()} />
      ) : (
        <CounterChart />
      )}
    </DashboardCard>
  );
};
