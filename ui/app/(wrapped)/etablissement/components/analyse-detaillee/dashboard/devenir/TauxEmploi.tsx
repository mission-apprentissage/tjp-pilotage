import { CounterChart } from "@/app/(wrapped)/etablissement/components/analyse-detaillee/components/CounterChart";
import { VerticalBarChart } from "@/app/(wrapped)/etablissement/components/analyse-detaillee/components/VerticalBarChart";
import {
  formatMillesime,
  formatTaux,
} from "@/app/(wrapped)/etablissement/components/analyse-detaillee/formatData";
import { ChiffresIJOffre } from "@/app/(wrapped)/etablissement/components/analyse-detaillee/types";
import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { TooltipIcon } from "@/components/TooltipIcon";

import { DashboardCard } from "../../../DashboardCard";

export const TauxEmploi = ({
  chiffresIJOffre,
}: {
  chiffresIJOffre?: ChiffresIJOffre;
}) => {
  const { openGlossaire } = useGlossaireContext();
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
      tooltip={
        <TooltipIcon
          ml="1"
          label="Taux d'emploi à 6 mois après la formation"
          onClick={() => openGlossaire("taux-emploi-6-mois")}
        />
      }
    >
      {chiffresIJOffre && checkDataAvailability(chiffresIJOffre) ? (
        <VerticalBarChart
          data={Object.keys(chiffresIJOffre)
            .filter((millesime) => chiffresIJOffre[millesime].tauxInsertion)
            .map((millesime) => ({
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
