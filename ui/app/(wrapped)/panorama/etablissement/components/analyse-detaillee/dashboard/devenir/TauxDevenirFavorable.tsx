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

export const TauxDevenirFavorable = ({ chiffresIJOffre }: { chiffresIJOffre?: ChiffresIJOffre }) => {
  const { openGlossaire } = useGlossaireContext();
  const checkDataAvailability = (): boolean => {
    if (chiffresIJOffre) {
      // @ts-expect-error TODO
      return Object.values(chiffresIJOffre).findIndex((value) => value.tauxDevenirFavorable) !== -1;
    }
    return false;
  };

  const getVerticalBarChartData = (): { label: string; value: number }[] => {
    if (chiffresIJOffre) {
      return Object.keys(chiffresIJOffre)
        .filter((millesime) => chiffresIJOffre[millesime].tauxDevenirFavorable)
        .map((millesime) => ({
          label: formatMillesime(millesime),
          value: formatTaux(chiffresIJOffre[millesime].tauxDevenirFavorable),
        }));
    }
    return [];
  };

  return (
    <DashboardCard
      label="Devenir favorable"
      tooltip={
        <TooltipIcon
          ml="1"
          label={
            <Box>
              <Text>
                (nombre d'élèves inscrits en formation + nombre d'élèves en emploi) / nombre d'élèves en entrée en
                dernière année de formation.
              </Text>
              <Text>Cliquez pour plus d'infos.</Text>
            </Box>
          }
          onClick={() => openGlossaire("taux-de-devenir-favorable")}
        />
      }
      badge={
        <Badge variant="lavander" size={"xs"}>
          Étab.
        </Badge>
      }
    >
      {checkDataAvailability() ? (
        <VerticalBarChart title="Devenir favorable" data={getVerticalBarChartData()} />
      ) : (
        <CounterChart />
      )}
    </DashboardCard>
  );
};
