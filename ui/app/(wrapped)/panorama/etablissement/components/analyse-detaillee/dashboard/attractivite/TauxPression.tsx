import { useToken } from "@chakra-ui/react";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { TooltipIcon } from "@/components/TooltipIcon";

import { DashboardCard } from "../../../DashboardCard";
import { CounterChart } from "../../components/CounterChart";
import { LineChart } from "../../components/LineChart";
import { formatAbsolute } from "../../formatData";
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
        établissement: Object.values(chiffresEntreeOffre)
          .map((value) => formatAbsolute(value.tauxPression))
          .filter((value) => value),
        départemental: Object.values(chiffresEntreeOffre)
          .map((value) => formatAbsolute(value.tauxPressionDepartemental))
          .filter((value) => value),
        régional: Object.values(chiffresEntreeOffre)
          .map((value) => formatAbsolute(value.tauxPressionRegional))
          .filter((value) => value),
        national: Object.values(chiffresEntreeOffre)
          .map((value) => formatAbsolute(value.tauxPressionNational))
          .filter((value) => value),
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
      return Object.keys(chiffresEntreeOffre).filter(
        (key) =>
          chiffresEntreeOffre[key].tauxPression ||
          chiffresEntreeOffre[key].tauxPressionNational ||
          chiffresEntreeOffre[key].tauxPressionRegional ||
          chiffresEntreeOffre[key].tauxPressionDepartemental
      );
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
