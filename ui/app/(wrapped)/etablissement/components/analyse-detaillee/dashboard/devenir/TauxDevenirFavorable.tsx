import { CounterChart } from "@/app/(wrapped)/etablissement/components/analyse-detaillee/components/CounterChart";
import { formatMillesime } from "@/app/(wrapped)/etablissement/components/analyse-detaillee/formatData";
import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { TooltipIcon } from "@/components/TooltipIcon";

import { DashboardCard } from "../../../DashboardCard";
import { VerticalBarChart } from "../../components/VerticalBarChart";
import { formatTaux } from "../../formatData";
import { ChiffresIJOffre } from "../../types";

export const TauxDevenirFavorable = ({
  chiffresIJOffre,
}: {
  chiffresIJOffre?: ChiffresIJOffre;
}) => {
  const { openGlossaire } = useGlossaireContext();
  const checkDataAvailability = (chiffresIJOffre: ChiffresIJOffre) => {
    return (
      Object.values(chiffresIJOffre).findIndex(
        (value) => value.tauxDevenirFavorable
      ) !== -1
    );
  };

  return (
    <DashboardCard
      label="Devenir favorable"
      tooltip={
        <TooltipIcon
          ml="1"
          label="Taux de devenir favorable"
          onClick={() => openGlossaire("taux-de-devenir-favorable")}
        />
      }
    >
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
