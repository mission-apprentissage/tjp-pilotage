import { VerticalBarChart } from "@/app/(wrapped)/etablissement/components/analyse-detaillee/components/VerticalBarChart";
import {
  formatMillesime,
  formatTaux,
} from "@/app/(wrapped)/etablissement/components/analyse-detaillee/formatData";
import { ChiffresIJOffre } from "@/app/(wrapped)/etablissement/components/analyse-detaillee/types";
import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { TooltipIcon } from "@/components/TooltipIcon";

import { DashboardCard } from "../../../DashboardCard";
import { CounterChart } from "../../components/CounterChart";

export const TauxPoursuiteEtudes = ({
  chiffresIJOffre,
}: {
  chiffresIJOffre?: ChiffresIJOffre;
}) => {
  const { openGlossaire } = useGlossaireContext();
  const checkDataAvailability = (chiffresIJOffre: ChiffresIJOffre) => {
    return (
      Object.values(chiffresIJOffre).findIndex(
        (value) => value.tauxPoursuite
      ) !== -1
    );
  };
  return (
    <DashboardCard
      label={"Poursuite d'études"}
      tooltip={
        <TooltipIcon
          ml="1"
          label="Poursuite d'études"
          onClick={() => openGlossaire("taux-poursuite-etudes")}
        />
      }
    >
      {chiffresIJOffre && checkDataAvailability(chiffresIJOffre) ? (
        <VerticalBarChart
          data={Object.keys(chiffresIJOffre).map((millesime) => ({
            label: formatMillesime(millesime),
            value: formatTaux(chiffresIJOffre[millesime].tauxPoursuite),
          }))}
        />
      ) : (
        <CounterChart />
      )}
    </DashboardCard>
  );
};
