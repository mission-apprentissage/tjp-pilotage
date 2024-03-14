import { Box, Text } from "@chakra-ui/react";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { TooltipIcon } from "@/components/TooltipIcon";

import { DashboardCard } from "../../../DashboardCard";
import { CounterChart } from "../../components/CounterChart";
import { VerticalBarChart } from "../../components/VerticalBarChart";
import { formatMillesime, formatTaux } from "../../formatData";
import { ChiffresIJOffre } from "../../types";

export const TauxPoursuiteEtudes = ({
  chiffresIJOffre,
}: {
  chiffresIJOffre?: ChiffresIJOffre;
}) => {
  const { openGlossaire } = useGlossaireContext();
  const checkDataAvailability = (): boolean => {
    if (chiffresIJOffre) {
      return (
        Object.values(chiffresIJOffre).findIndex(
          (value) => value.tauxPoursuite
        ) !== -1
      );
    }
    return false;
  };

  const getVerticalBarChartData = (): { label: string; value: number }[] => {
    if (chiffresIJOffre) {
      return Object.keys(chiffresIJOffre)
        .filter((millesime) => chiffresIJOffre[millesime].tauxPoursuite)
        .map((millesime) => ({
          label: formatMillesime(millesime),
          value: formatTaux(chiffresIJOffre[millesime].tauxPoursuite),
        }));
    }
    return [];
  };
  return (
    <DashboardCard
      label={"Poursuite d'études"}
      tooltip={
        <TooltipIcon
          ml="1"
          label={
            <Box>
              <Text>
                Tout élève inscrit à N+1 (réorientation et redoublement
                compris).
              </Text>
              <Text>Cliquez pour plus d'infos.</Text>
            </Box>
          }
          onClick={() => openGlossaire("taux-poursuite-etudes")}
        />
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
