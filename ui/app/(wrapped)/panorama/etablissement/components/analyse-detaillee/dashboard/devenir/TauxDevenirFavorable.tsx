import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { TooltipIcon } from "@/components/TooltipIcon";

import { DashboardCard } from "../../../DashboardCard";
import { CounterChart } from "../../components/CounterChart";
import { VerticalBarChart } from "../../components/VerticalBarChart";
import { formatMillesime, formatTaux } from "../../formatData";
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
          data={Object.keys(chiffresIJOffre)
            .filter(
              (millesime) => chiffresIJOffre[millesime].tauxDevenirFavorable
            )
            .map((millesime) => ({
              label: formatMillesime(millesime),
              value: formatTaux(
                chiffresIJOffre[millesime].tauxDevenirFavorable
              ),
            }))}
        />
      ) : (
        <CounterChart />
      )}
    </DashboardCard>
  );
};
