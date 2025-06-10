import {Badge, Flex,Text} from '@chakra-ui/react';
import {CURRENT_IJ_MILLESIME} from 'shared';

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { CounterChart } from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/components/CounterChart";
import { VerticalBarChart } from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/components/VerticalBarChart";
import type { ChiffresIJOffre } from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/types";
import { DashboardCard } from "@/app/(wrapped)/panorama/etablissement/components/DashboardCard";
import { TooltipIcon } from "@/components/TooltipIcon";
import {formatMillesime} from '@/utils/formatLibelle';
import {formatPercentageWithoutSign} from '@/utils/formatUtils';

const checkDataAvailability = ({ chiffresIJOffre }: { chiffresIJOffre?: ChiffresIJOffre }): boolean => {
  if (chiffresIJOffre) {
    return Object.values(chiffresIJOffre).findIndex((value) => value.tauxInsertion) !== -1;
  }
  return false;
};

const getVerticalBarChartData = ({
  chiffresIJOffre,
}: {
  chiffresIJOffre?: ChiffresIJOffre;
}): { label: string; value: number }[] => {
  if (chiffresIJOffre) {
    return Object.keys(chiffresIJOffre)
      .filter((millesime) => chiffresIJOffre[millesime].tauxInsertion)
      .map((millesime) => ({
        label: formatMillesime(millesime),
        value: formatPercentageWithoutSign(chiffresIJOffre[millesime].tauxInsertion),
      }));
  }
  return [];
};

export const TauxEmploi = ({ chiffresIJOffre }: { chiffresIJOffre?: ChiffresIJOffre }) => {
  const { openGlossaire } = useGlossaireContext();

  return (
    <DashboardCard
      label="Taux d'emploi à 6 mois"
      tooltip={
        <TooltipIcon
          ml="1"
          label={
            <Flex direction="column" gap={2}>
              <Text>
                La part de ceux qui sont en emploi 6 mois après leur sortie d’étude
                (millésimes {formatMillesime(CURRENT_IJ_MILLESIME)}).
              </Text>
              <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
            </Flex>
          }
          onClick={() => openGlossaire("taux-emploi-6-mois")}
        />
      }
      badge={
        <Badge variant="lavander" size={"xs"}>
          Étab.
        </Badge>
      }
    >
      {checkDataAvailability({ chiffresIJOffre }) ? (
        <VerticalBarChart title="Taux d'emploi à 6 mois" data={getVerticalBarChartData({ chiffresIJOffre })} />
      ) : (
        <CounterChart />
      )}
    </DashboardCard>
  );
};
