import { useToken } from "@chakra-ui/react";

import { DashboardCard } from "@/app/(wrapped)/etablissement/components/DashboardCard";

import { CounterChart } from "../../components/CounterChart";
import { LineChart } from "../../components/LineChart";
import { formatTaux } from "../../formatData";
import { ChiffresEntreeOffre } from "../../types";

export const TauxPression = ({
  chiffresEntreeOffre,
}: {
  chiffresEntreeOffre?: ChiffresEntreeOffre;
}) => {
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
          formatTaux(value.tauxPression)
        ),
        national: Object.values(chiffresEntreeOffre).map((value) =>
          formatTaux(value.tauxPressionNational)
        ),
        régional: Object.values(chiffresEntreeOffre).map((value) =>
          formatTaux(value.tauxPressionRegional)
        ),
        départemental: Object.values(chiffresEntreeOffre).map((value) =>
          formatTaux(value.tauxPressionDepartemental)
        ),
      };
    }
    return {
      établissement: [],
      national: [],
      régional: [],
      départemental: [],
    };
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
    <DashboardCard label="Taux de pression">
      {chiffresEntreeOffre && checkDataAvailability(chiffresEntreeOffre) ? (
        <LineChart
          data={getData(chiffresEntreeOffre)}
          colors={colors}
          mainKey="établissement"
        />
      ) : (
        <CounterChart />
      )}
    </DashboardCard>
  );
};
