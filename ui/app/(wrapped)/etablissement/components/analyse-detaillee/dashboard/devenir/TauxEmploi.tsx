import { CounterChart } from "@/app/(wrapped)/etablissement/components/analyse-detaillee/components/CounterChart";
import { VerticalBarChart } from "@/app/(wrapped)/etablissement/components/analyse-detaillee/components/VerticalBarChart";
import {
  formatMillesime,
  formatTaux,
} from "@/app/(wrapped)/etablissement/components/analyse-detaillee/formatData";
import { ChiffresIJOffre } from "@/app/(wrapped)/etablissement/components/analyse-detaillee/types";

import { DashboardCard } from "../../../DashboardCard";

export const TauxEmploi = ({
  chiffresIJOffre,
}: {
  chiffresIJOffre?: ChiffresIJOffre;
}) => {
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
      tooltip="Taux d'emploi à 6 mois après la formation"
    >
      {chiffresIJOffre && checkDataAvailability(chiffresIJOffre) ? (
        <VerticalBarChart
          data={Object.keys(chiffresIJOffre).map((millesime) => ({
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
