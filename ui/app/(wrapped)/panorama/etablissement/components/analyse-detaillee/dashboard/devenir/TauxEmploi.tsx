import { Badge, Box, Text } from "@chakra-ui/react";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { CounterChart } from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/components/CounterChart";
import { VerticalBarChart } from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/components/VerticalBarChart";
import {
  formatMillesime,
  formatTaux,
} from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/formatData";
import type { ChiffresIJOffre } from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/types";
import { DashboardCard } from "@/app/(wrapped)/panorama/etablissement/components/DashboardCard";
import { TooltipIcon } from "@/components/TooltipIcon";

const checkDataAvailability = ({ chiffresIJOffre }: { chiffresIJOffre?: ChiffresIJOffre }): boolean => {
  if (chiffresIJOffre) {
    return Object.values(chiffresIJOffre).findIndex((value) => value.tauxInsertion) !== -1;
  }
  return false;
};

const getVerticalBarChartData = ({
  chiffresIJOffre,
}: {
  chiffresIJOffre?: ChiffresIJOffre;
}): { label: string; value: number }[] => {
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

export const TauxEmploi = ({ chiffresIJOffre }: { chiffresIJOffre?: ChiffresIJOffre }) => {
  const { openGlossaire } = useGlossaireContext();

  return (
    <DashboardCard
      label="Taux d'emploi à 6 mois"
      tooltip={
        <TooltipIcon
          ml="1"
          label={
            <Box>
              <Text>La part de ceux qui sont en emploi 6 mois après leur sortie d’étude.</Text>
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
      {checkDataAvailability({ chiffresIJOffre }) ? (
        <VerticalBarChart title="Taux d'emploi à 6 mois" data={getVerticalBarChartData({ chiffresIJOffre })} />
      ) : (
        <CounterChart />
      )}
    </DashboardCard>
  );
};
