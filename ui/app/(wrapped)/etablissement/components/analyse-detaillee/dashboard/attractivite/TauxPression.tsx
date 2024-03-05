import { useToken } from "@chakra-ui/react";

import { formatAbsolute } from "@/app/(wrapped)/etablissement/components/analyse-detaillee/formatData";
import { DashboardCard } from "@/app/(wrapped)/etablissement/components/DashboardCard";
import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { TooltipIcon } from "@/components/TooltipIcon";

import { CounterChart } from "../../components/CounterChart";
import { LineChart } from "../../components/LineChart";
import { ChiffresEntreeOffre } from "../../types";

const CODE_NIVEAU_DIPLOME_BTS = "320";

export const TauxPression = ({
  codeNiveauDiplome,
  chiffresEntreeOffre,
}: {
  codeNiveauDiplome?: string;
  chiffresEntreeOffre?: ChiffresEntreeOffre;
}) => {
  const { openGlossaire } = useGlossaireContext();
  const checkDataAvailability = (chiffresEntreeOffre: ChiffresEntreeOffre) => {
    return (
      Object.values(chiffresEntreeOffre).findIndex(
        (value) =>
          value.tauxPression &&
          value.tauxPressionNational &&
          value.tauxPressionRegional &&
          value.tauxPressionDepartemental
      ) !== -1
    );
  };

  const getData = (chiffresEntreeOffre?: ChiffresEntreeOffre) => {
    if (chiffresEntreeOffre) {
      return {
        établissement: Object.values(chiffresEntreeOffre).map((value) =>
          formatAbsolute(value.tauxPression)
        ),
        départemental: Object.values(chiffresEntreeOffre).map((value) =>
          formatAbsolute(value.tauxPressionDepartemental)
        ),
        régional: Object.values(chiffresEntreeOffre).map((value) =>
          formatAbsolute(value.tauxPressionRegional)
        ),
        national: Object.values(chiffresEntreeOffre).map((value) =>
          formatAbsolute(value.tauxPressionNational)
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

  const getCategories = (chiffresEntreeOffre?: ChiffresEntreeOffre) => {
    if (chiffresEntreeOffre) {
      return Object.keys(chiffresEntreeOffre);
    }
  };

  const blue = useToken("colors", "bluefrance.113");
  const green = useToken("colors", "greenarchipel.557");
  const orange = useToken("colors", "orangeterrebattue.645");
  const purple = useToken("colors", "purpleglycine.494");
  const colors: Record<string, string> = {
    établissement: blue,
    national: purple,
    régional: green,
    départemental: orange,
  };

  return (
    <DashboardCard
      label={
        codeNiveauDiplome === CODE_NIVEAU_DIPLOME_BTS
          ? "Taux de demande"
          : "Taux de pression"
      }
      tooltip={
        <TooltipIcon
          ml="1"
          label={
            codeNiveauDiplome === CODE_NIVEAU_DIPLOME_BTS
              ? "Taux de demande"
              : "Taux de pression"
          }
          onClick={() => openGlossaire("taux-de-pression")}
        />
      }
    >
      {chiffresEntreeOffre && checkDataAvailability(chiffresEntreeOffre) ? (
        <LineChart
          data={getData(chiffresEntreeOffre)}
          categories={getCategories(chiffresEntreeOffre)}
          colors={colors}
          defaultMainKey="établissement"
        />
      ) : (
        <CounterChart />
      )}
    </DashboardCard>
  );
};
