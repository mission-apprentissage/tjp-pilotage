import { Box, Text, useToken } from "@chakra-ui/react";

import { CounterChart } from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/components/CounterChart";
import { LineChart } from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/components/LineChart";
import { formatAbsoluteOrUndefined } from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/formatData";
import type { ChiffresEntreeOffre } from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/types";
import { DashboardCard } from "@/app/(wrapped)/panorama/etablissement/components/DashboardCard";
import { GlossaireShortcut } from "@/components/GlossaireShortcut";

const CODE_NIVEAU_DIPLOME_BTS = "320";

export const TauxPression = ({
  codeNiveauDiplome,
  chiffresEntreeOffre,
}: {
  codeNiveauDiplome?: string;
  chiffresEntreeOffre?: ChiffresEntreeOffre;
}) => {
  const checkDataAvailability = (): boolean => {
    if (chiffresEntreeOffre) {
      return (
        Object.values(chiffresEntreeOffre).findIndex(
          (value) =>
            // @ts-expect-error TODO
            value.tauxPression &&
            // @ts-expect-error TODO
            value.tauxPressionNational &&
            // @ts-expect-error TODO
            value.tauxPressionRegional &&
            // @ts-expect-error TODO
            value.tauxPressionDepartemental
        ) !== -1
      );
    }
    return false;
  };

  const getData = (): {
    établissement: Array<number | undefined>;
    départemental: Array<number | undefined>;
    régional: Array<number | undefined>;
    national: Array<number | undefined>;
  } => {
    if (chiffresEntreeOffre) {
      return {
        // @ts-expect-error TODO
        établissement: Object.values(chiffresEntreeOffre).map((value) => formatAbsoluteOrUndefined(value.tauxPression)),
        départemental: Object.values(chiffresEntreeOffre).map((value) =>
          // @ts-expect-error TODO
          formatAbsoluteOrUndefined(value.tauxPressionDepartemental)
        ),
        régional: Object.values(chiffresEntreeOffre).map((value) =>
          // @ts-expect-error TODO
          formatAbsoluteOrUndefined(value.tauxPressionRegional)
        ),
        national: Object.values(chiffresEntreeOffre).map((value) =>
          // @ts-expect-error TODO
          formatAbsoluteOrUndefined(value.tauxPressionNational)
        ),
      };
    }
    return {
      établissement: [],
      départemental: [],
      régional: [],
      national: [],
    };
  };

  const getCategories = (): string[] => {
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
              <Box>
                <Text>Le ratio entre le nombre de voeux et la capacité de la formation dans l'établissement.</Text>
                <Text>Cliquez pour plus d'infos.</Text>
              </Box>
            }
            glossaireEntryKey="taux-de-demande"
          />
        ) : (
          <GlossaireShortcut
            tooltip={
              <Box>
                <Text>
                  Le ratio entre le nombre de premiers voeux et la capacité de la formation dans l'établissement.
                </Text>
                <Text>Cliquez pour plus d'infos.</Text>
              </Box>
            }
            glossaireEntryKey="taux-de-pression"
          />
        )
      }
    >
      {chiffresEntreeOffre && checkDataAvailability() ? (
        <LineChart
          title={codeNiveauDiplome === CODE_NIVEAU_DIPLOME_BTS ? "Taux de demande" : "Taux de pression"}
          data={getData()}
          categories={getCategories()}
          colors={colors}
          defaultMainKey="établissement"
        />
      ) : (
        <CounterChart />
      )}
    </DashboardCard>
  );
};
