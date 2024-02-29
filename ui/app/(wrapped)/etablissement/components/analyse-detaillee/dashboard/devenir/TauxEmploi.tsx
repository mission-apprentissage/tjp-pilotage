import { CounterChart } from "@/app/(wrapped)/etablissement/components/analyse-detaillee/components/CounterChart";
import { VerticalBarChart } from "@/app/(wrapped)/etablissement/components/analyse-detaillee/components/VerticalBarChart";
import {
  formatMillesime,
  formatTaux,
} from "@/app/(wrapped)/etablissement/components/analyse-detaillee/formatData";
import { ChiffresIJ } from "@/app/(wrapped)/etablissement/components/analyse-detaillee/types";

import { DashboardCard } from "../../../DashboardCard";

export const TauxEmploi = ({ chiffresIj }: { chiffresIj?: ChiffresIJ }) => {
  const checkDataAvailability = (chiffresIj: ChiffresIJ) => {
    return (
      Object.values(chiffresIj).findIndex((value) => value.tauxInsertion) !== -1
    );
  };
  return (
    <DashboardCard
      label="Taux d'emploi à 6 mois"
      tooltip="Taux d'emploi à 6 mois après la formation"
    >
      {chiffresIj && checkDataAvailability(chiffresIj) ? (
        <VerticalBarChart
          data={Object.keys(chiffresIj).map((millesime) => ({
            label: formatMillesime(millesime),
            value: formatTaux(chiffresIj[millesime].tauxInsertion),
          }))}
        />
      ) : (
        <CounterChart />
      )}
    </DashboardCard>
  );
};
