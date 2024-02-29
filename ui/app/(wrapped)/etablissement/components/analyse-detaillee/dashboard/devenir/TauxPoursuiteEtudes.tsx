import { VerticalBarChart } from "@/app/(wrapped)/etablissement/components/analyse-detaillee/components/VerticalBarChart";
import {
  formatMillesime,
  formatTaux,
} from "@/app/(wrapped)/etablissement/components/analyse-detaillee/formatData";
import { ChiffresIJ } from "@/app/(wrapped)/etablissement/components/analyse-detaillee/types";

import { DashboardCard } from "../../../DashboardCard";
import { CounterChart } from "../../components/CounterChart";

export const TauxPoursuiteEtudes = ({
  chiffresIj,
}: {
  chiffresIj?: ChiffresIJ;
}) => {
  const checkDataAvailability = (chiffresIj: ChiffresIJ) => {
    return (
      Object.values(chiffresIj).findIndex((value) => value.tauxPoursuite) !== -1
    );
  };
  return (
    <DashboardCard
      label={"Poursuite d'études"}
      tooltip={"Taux de poursuite d'études"}
    >
      {chiffresIj && checkDataAvailability(chiffresIj) ? (
        <VerticalBarChart
          data={Object.keys(chiffresIj).map((millesime) => ({
            label: formatMillesime(millesime),
            value: formatTaux(chiffresIj[millesime].tauxPoursuite),
          }))}
        />
      ) : (
        <CounterChart />
      )}
    </DashboardCard>
  );
};
