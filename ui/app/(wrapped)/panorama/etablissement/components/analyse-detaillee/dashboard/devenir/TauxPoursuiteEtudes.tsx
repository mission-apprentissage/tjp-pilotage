import { Badge } from "@chakra-ui/react";

import { TooltipDefinitionTauxPoursuiteEtudes } from "@/app/(wrapped)/components/definitions/DefinitionTauxPoursuiteEtudes";
import { CounterChart } from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/components/CounterChart";
import { VerticalBarChart } from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/components/VerticalBarChart";
import {
  formatMillesime,
  formatTaux,
} from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/formatData";
import type { ChiffresIJOffre } from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/types";
import { DashboardCard } from "@/app/(wrapped)/panorama/etablissement/components/DashboardCard";

const checkDataAvailability = ({ chiffresIJOffre }: { chiffresIJOffre?: ChiffresIJOffre }): boolean => {
  if (chiffresIJOffre) {
    return Object.values(chiffresIJOffre).findIndex((value) => value.tauxPoursuite) !== -1;
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
      .filter((millesime) => chiffresIJOffre[millesime].tauxPoursuite)
      .map((millesime) => ({
        label: formatMillesime(millesime),
        value: formatTaux(chiffresIJOffre[millesime].tauxPoursuite),
      }));
  }
  return [];
};

export const TauxPoursuiteEtudes = ({ chiffresIJOffre }: { chiffresIJOffre?: ChiffresIJOffre }) => {
  return (
    <DashboardCard
      label={"Poursuite d'études"}
      tooltip={<TooltipDefinitionTauxPoursuiteEtudes />}
      badge={
        <Badge variant="lavander" size={"xs"}>
          Étab.
        </Badge>
      }
    >
      {checkDataAvailability({ chiffresIJOffre }) ? (
        <VerticalBarChart title="Poursuite d'études" data={getVerticalBarChartData({ chiffresIJOffre })} />
      ) : (
        <CounterChart />
      )}
    </DashboardCard>
  );
};
