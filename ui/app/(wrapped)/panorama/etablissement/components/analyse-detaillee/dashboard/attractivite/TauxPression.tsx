import { Flex,Text, useToken} from '@chakra-ui/react';

import { CounterChart } from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/components/CounterChart";
import { LineChart } from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/components/LineChart";
import type { ChiffresEntreeOffre } from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/types";
import { DashboardCard } from "@/app/(wrapped)/panorama/etablissement/components/DashboardCard";
import { GlossaireShortcut } from "@/components/GlossaireShortcut";
import {formatNumber} from '@/utils/formatUtils';

const CODE_NIVEAU_DIPLOME_BTS = "320";

const checkDataAvailability = ({ chiffresEntreeOffre }: { chiffresEntreeOffre?: ChiffresEntreeOffre }): boolean => {
  if (chiffresEntreeOffre) {
    return (
      Object.values(chiffresEntreeOffre).findIndex(
        (value) =>
          value.tauxPression &&
          value.tauxPressionNational &&
          value.tauxPressionRegional &&
          value.tauxPressionDepartemental
      ) !== -1
    );
  }
  return false;
};

const getData = ({
  chiffresEntreeOffre,
}: {
  chiffresEntreeOffre?: ChiffresEntreeOffre;
}): {
  établissement: Array<number | undefined>;
  départemental: Array<number | undefined>;
  régional: Array<number | undefined>;
  national: Array<number | undefined>;
} => {
  if (chiffresEntreeOffre) {
    // Conserve uniquement les entrées où au moins une valeur est définie
    const filteredData = Object.values(chiffresEntreeOffre).filter((value) => {
      return !(
        value.tauxPression === undefined &&
        value.tauxPressionDepartemental === undefined &&
        value.tauxPressionRegional === undefined &&
        value.tauxPressionNational === undefined
      );
    });

    return {
      établissement: filteredData.map((value) => formatNumber(value.tauxPression, 2, undefined)),
      départemental: filteredData.map((value) => formatNumber(value.tauxPressionDepartemental, 2, undefined)),
      régional: filteredData.map((value) => formatNumber(value.tauxPressionRegional, 2, undefined)),
      national: filteredData.map((value) => formatNumber(value.tauxPressionNational, 2, undefined)),
    };
  }
  return {
    établissement: [],
    départemental: [],
    régional: [],
    national: [],
  };
};

const getCategories = ({ chiffresEntreeOffre }: { chiffresEntreeOffre?: ChiffresEntreeOffre }): string[] => {
  if (chiffresEntreeOffre) {
    return Object.keys(chiffresEntreeOffre).filter(
      (key) =>
        chiffresEntreeOffre[key].tauxPression ||
        chiffresEntreeOffre[key].tauxPressionNational ||
        chiffresEntreeOffre[key].tauxPressionRegional ||
        chiffresEntreeOffre[key].tauxPressionDepartemental
    );
  }
  return [];
};

export const TauxPression = ({
  codeNiveauDiplome,
  chiffresEntreeOffre,
}: {
  codeNiveauDiplome?: string;
  chiffresEntreeOffre?: ChiffresEntreeOffre;
}) => {
  const blue = useToken("colors", "bluefrance.113");
  const green = useToken("colors", "greenArchipel.557");
  const orange = useToken("colors", "orangeTerreBattue.645");
  const purple = useToken("colors", "purpleGlycine.494");
  const colors: Record<string, string> = {
    établissement: blue,
    national: purple,
    régional: green,
    départemental: orange,
  };

  return (
    <DashboardCard
      label={codeNiveauDiplome === CODE_NIVEAU_DIPLOME_BTS ? "Taux de demande" : "Taux de pression"}
      tooltip={
        codeNiveauDiplome === CODE_NIVEAU_DIPLOME_BTS ? (
          <GlossaireShortcut
            tooltip={
              <Flex direction="column" gap={2}>
                <Text>Le ratio entre le nombre de voeux et la capacité de la formation dans l'établissement.</Text>
                <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
              </Flex>
            }
            glossaireEntryKey="taux-de-demande"
          />
        ) : (
          <GlossaireShortcut
            tooltip={
              <Flex direction="column" gap={2}>
                <Text>
                  Le ratio entre le nombre de premiers voeux et la capacité de la formation dans l'établissement.
                </Text>
                <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
              </Flex>
            }
            glossaireEntryKey="taux-de-pression"
          />
        )
      }
    >
      {chiffresEntreeOffre && checkDataAvailability({ chiffresEntreeOffre }) ? (
        <LineChart
          title={codeNiveauDiplome === CODE_NIVEAU_DIPLOME_BTS ? "Taux de demande" : "Taux de pression"}
          data={getData({ chiffresEntreeOffre })}
          categories={getCategories({ chiffresEntreeOffre })}
          colors={colors}
          defaultMainKey="établissement"
        />
      ) : (
        <CounterChart />
      )}
    </DashboardCard>
  );
};
