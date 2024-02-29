import { CounterChart } from "@/app/(wrapped)/etablissement/components/analyse-detaillee/components/CounterChart";
import { formatMillesime } from "@/app/(wrapped)/etablissement/components/analyse-detaillee/formatData";

import { DashboardCard } from "../../../DashboardCard";
import { VerticalBarChart } from "../../components/VerticalBarChart";
import { formatTaux } from "../../formatData";
import { ChiffresIJ } from "../../types";

export const TauxDevenirFavorable = ({
  chiffresIj,
}: {
  chiffresIj?: ChiffresIJ;
}) => {
  const checkDataAvailability = (chiffresIj: ChiffresIJ) => {
    return (
      Object.values(chiffresIj).findIndex(
        (value) => value.tauxDevenirFavorable
      ) !== -1
    );
  };

  return (
    <DashboardCard label="Devenir favorable">
      {chiffresIj && checkDataAvailability(chiffresIj) ? (
        <VerticalBarChart
          data={Object.keys(chiffresIj).map((millesime) => ({
            label: formatMillesime(millesime),
            value: formatTaux(chiffresIj[millesime].tauxDevenirFavorable),
          }))}
        />
      ) : (
        <CounterChart />
      )}
    </DashboardCard>
  );
};
