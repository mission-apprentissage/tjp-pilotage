import { CURRENT_RENTREE } from "shared";

import { CounterChart } from "@/app/(wrapped)/etablissement/components/analyse-detaillee/components/CounterChart";

import { DashboardCard } from "../../../DashboardCard";
import { HorizontalBarChart } from "../../components/HorizontalBarChart";
import { ChiffresEntree } from "../../types";

export const NombreElevesParAnnee = ({
  chiffresEntree,
}: {
  chiffresEntree?: ChiffresEntree;
}) => {
  const checkDataAvailability = (chiffresEntree: ChiffresEntree) => {
    return (
      Object.values(chiffresEntree).findIndex(
        (value) =>
          value.effectifAnnee1 || value.effectifAnnee2 || value.effectifAnnee3
      ) !== -1
    );
  };
  return (
    <DashboardCard label="Nombre d'élèves par année (Constat de rentrée 2023)">
      {chiffresEntree && checkDataAvailability(chiffresEntree) ? (
        <HorizontalBarChart
          data={Object.values(chiffresEntree).reduce(
            (acc, rentreeScolaire) => {
              acc[rentreeScolaire.rentreeScolaire] = [
                {
                  label: "Année 1",
                  value: rentreeScolaire.effectifAnnee1 ?? 0,
                },
                {
                  label: "Année 2",
                  value: rentreeScolaire.effectifAnnee1 ?? 0,
                },
                {
                  label: "Année 3",
                  value: rentreeScolaire.effectifAnnee1 ?? 0,
                },
              ];
              return acc;
            },
            {} as Record<string, { label: string; value: number }[]>
          )}
          rentreeScolaire={CURRENT_RENTREE}
        />
      ) : (
        <CounterChart />
      )}
    </DashboardCard>
  );
};
