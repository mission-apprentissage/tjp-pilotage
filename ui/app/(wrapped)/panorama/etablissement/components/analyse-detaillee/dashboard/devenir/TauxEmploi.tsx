import { Badge } from "@chakra-ui/react";

import { TooltipDefinitionTauxEmploi6Mois } from "@/app/(wrapped)/components/definitions/DefinitionTauxEmploi6Mois";
import { CounterChart } from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/components/CounterChart";
import { VerticalBarChart } from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/components/VerticalBarChart";
import type { ChiffresIJOffre } from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/types";
import { DashboardCard } from "@/app/(wrapped)/panorama/etablissement/components/DashboardCard";
import { formatMillesime } from '@/utils/formatLibelle';
import { formatPercentageWithoutSign } from '@/utils/formatUtils';

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
        value: formatPercentageWithoutSign(chiffresIJOffre[millesime].tauxInsertion),
      }));
  }
  return [];
};

export const TauxEmploi = ({ chiffresIJOffre }: { chiffresIJOffre?: ChiffresIJOffre }) => {
  return (
    <DashboardCard
      label="Taux d'emploi à 6 mois"
      tooltip={<TooltipDefinitionTauxEmploi6Mois />}
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
