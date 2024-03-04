import { CounterChart } from "@/app/(wrapped)/etablissement/components/analyse-detaillee/components/CounterChart";
import { formatMillesime } from "@/app/(wrapped)/etablissement/components/analyse-detaillee/formatData";

import { DashboardCard } from "../../../DashboardCard";
import { VerticalBarChart } from "../../components/VerticalBarChart";
import { formatTaux } from "../../formatData";
import { ChiffresIJOffre } from "../../types";

export const TauxDevenirFavorable = ({
  chiffresIJOffre,
}: {
  chiffresIJOffre?: ChiffresIJOffre;
}) => {
  const checkDataAvailability = (chiffresIJOffre: ChiffresIJOffre) => {
    return (
      Object.values(chiffresIJOffre).findIndex(
        (value) => value.tauxDevenirFavorable
      ) !== -1
    );
  };

  return (
    <DashboardCard label="Devenir favorable">
      {chiffresIJOffre && checkDataAvailability(chiffresIJOffre) ? (
        <VerticalBarChart
          data={Object.keys(chiffresIJOffre).map((millesime) => ({
            label: formatMillesime(millesime),
            value: formatTaux(chiffresIJOffre[millesime].tauxDevenirFavorable),
          }))}
        />
      ) : (
        <CounterChart />
      )}
    </DashboardCard>
  );
};
