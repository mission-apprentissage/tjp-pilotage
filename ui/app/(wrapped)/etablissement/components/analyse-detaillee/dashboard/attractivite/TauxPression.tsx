import { useToken } from "@chakra-ui/react";

import { DashboardCard } from "@/app/(wrapped)/etablissement/components/DashboardCard";

import { CounterChart } from "../../components/CounterChart";
import { LineChart } from "../../components/LineChart";
import { formatTaux } from "../../formatData";
import { ChiffresEntree } from "../../types";

export const TauxPression = ({
  chiffresEntree,
}: {
  chiffresEntree?: ChiffresEntree;
}) => {
  const checkDataAvailability = (chiffresEntree: ChiffresEntree) => {
    return (
      Object.values(chiffresEntree).findIndex(
        (value) =>
          value.tauxPression &&
          value.tauxPressionNational &&
          value.tauxPressionRegional &&
          value.tauxPressionDepartemental
      ) !== -1
    );
  };

  const getData = (chiffresEntree?: ChiffresEntree) => {
    if (chiffresEntree) {
      return {
        "Taux de pression établissement": Object.values(chiffresEntree).map(
          (value) => formatTaux(value.tauxPression)
        ),
        "Taux de pression national": Object.values(chiffresEntree).map(
          (value) => formatTaux(value.tauxPressionNational)
        ),
        "Taux de pression régional": Object.values(chiffresEntree).map(
          (value) => formatTaux(value.tauxPressionRegional)
        ),
        "Taux de pression départemental": Object.values(chiffresEntree).map(
          (value) => formatTaux(value.tauxPressionDepartemental)
        ),
      };
    }
    return {
      "Taux de pression établissement": [],
      "Taux de pression national": [],
      "Taux de pression régional": [],
      "Taux de pression départemental": [],
    };
  };

  const blue = useToken("colors", "bluefrance.113");
  const green = useToken("colors", "greenarchipel.557");
  const orange = useToken("colors", "orangeterrebattue.645");
  const purple = useToken("colors", "purpleglycine.494");
  const colors: Record<string, string> = {
    "Taux de pression établissement": blue,
    "Taux de pression national": purple,
    "Taux de pression régional": green,
    "Taux de pression départemental": orange,
  };

  return (
    <DashboardCard label="Taux de pression">
      {chiffresEntree && checkDataAvailability(chiffresEntree) ? (
        <LineChart
          data={getData(chiffresEntree)}
          colors={colors}
          mainKey="Taux de pression établissement"
        />
      ) : (
        <CounterChart />
      )}
    </DashboardCard>
  );
};
