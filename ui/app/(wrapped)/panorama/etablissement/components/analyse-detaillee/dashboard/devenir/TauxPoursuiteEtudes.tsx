import { Badge, Box, Text } from "@chakra-ui/react";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { CounterChart } from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/components/CounterChart";
import { VerticalBarChart } from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/components/VerticalBarChart";
import {
  formatMillesime,
  formatTaux,
} from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/formatData";
import type { ChiffresIJOffre } from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/types";
import { DashboardCard } from "@/app/(wrapped)/panorama/etablissement/components/DashboardCard";
import { TooltipIcon } from "@/components/TooltipIcon";

export const TauxPoursuiteEtudes = ({ chiffresIJOffre }: { chiffresIJOffre?: ChiffresIJOffre }) => {
  const { openGlossaire } = useGlossaireContext();
  const checkDataAvailability = (): boolean => {
    if (chiffresIJOffre) {
      // @ts-expect-error TODO
      return Object.values(chiffresIJOffre).findIndex((value) => value.tauxPoursuite) !== -1;
    }
    return false;
  };

  const getVerticalBarChartData = (): { label: string; value: number }[] => {
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
  return (
    <DashboardCard
      label={"Poursuite d'études"}
      tooltip={
        <TooltipIcon
          ml="1"
          label={
            <Box>
              <Text>Tout élève inscrit à N+1 (réorientation et redoublement compris).</Text>
              <Text>Cliquez pour plus d'infos.</Text>
            </Box>
          }
          onClick={() => openGlossaire("taux-poursuite-etudes")}
        />
      }
      badge={
        <Badge variant="lavander" size={"xs"}>
          Étab.
        </Badge>
      }
    >
      {checkDataAvailability() ? (
        <VerticalBarChart title="Poursuite d'études" data={getVerticalBarChartData()} />
      ) : (
        <CounterChart />
      )}
    </DashboardCard>
  );
};
