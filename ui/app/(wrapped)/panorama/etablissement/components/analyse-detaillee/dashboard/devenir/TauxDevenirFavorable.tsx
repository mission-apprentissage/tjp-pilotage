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
    return Object.values(chiffresIJOffre).findIndex((value) => value.tauxDevenirFavorable) !== -1;
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
      .filter((millesime) => chiffresIJOffre[millesime].tauxDevenirFavorable)
      .map((millesime) => ({
        label: formatMillesime(millesime),
        value: formatPercentageWithoutSign(chiffresIJOffre[millesime].tauxDevenirFavorable),
      }));
  }
  return [];
};

export const TauxDevenirFavorable = ({ chiffresIJOffre }: { chiffresIJOffre?: ChiffresIJOffre }) => {
  const { openGlossaire } = useGlossaireContext();

  return (
    <DashboardCard
      label="Devenir favorable"
      tooltip={
        <TooltipIcon
          ml="1"
          label={
            <Flex direction="column" gap={2}>
              <Text>
                (nombre d'élèves inscrits en formation + nombre d'élèves en emploi) / nombre d'élèves en entrée en
                dernière année de formation (millésimes {formatMillesime(CURRENT_IJ_MILLESIME)}).
              </Text>
              <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
            </Flex>
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
      {checkDataAvailability({ chiffresIJOffre }) ? (
        <VerticalBarChart title="Devenir favorable" data={getVerticalBarChartData({ chiffresIJOffre })} />
      ) : (
        <CounterChart />
      )}
    </DashboardCard>
  );
};
