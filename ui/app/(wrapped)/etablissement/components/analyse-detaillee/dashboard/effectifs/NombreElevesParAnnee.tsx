import { CounterChart } from "@/app/(wrapped)/etablissement/components/analyse-detaillee/components/CounterChart";

import { DashboardCard } from "../../../DashboardCard";
import { HorizontalBarChart } from "../../components/HorizontalBarChart";
import { ChiffresEntreeOffre } from "../../types";

export const NombreElevesParAnnee = ({
  chiffresEntreeOffre,
}: {
  chiffresEntreeOffre?: ChiffresEntreeOffre;
}) => {
  const checkDataAvailability = (chiffresEntreeOffre: ChiffresEntreeOffre) => {
    return (
      Object.values(chiffresEntreeOffre).findIndex(
        (value) =>
          value.effectifAnnee1 || value.effectifAnnee2 || value.effectifAnnee3
      ) !== -1
    );
  };
  return (
    <DashboardCard label="Nombre d'élèves par année (Constat de rentrée 2023)">
      {chiffresEntreeOffre && checkDataAvailability(chiffresEntreeOffre) ? (
        <HorizontalBarChart
          data={Object.values(chiffresEntreeOffre).reduce(
            (acc, rentreeScolaire) => {
              acc[rentreeScolaire.rentreeScolaire] = [];
              if (rentreeScolaire.effectifAnnee1) {
                acc[rentreeScolaire.rentreeScolaire].push({
                  label: "Année 1",
                  value: rentreeScolaire.effectifAnnee1,
                });
              }
              if (rentreeScolaire.effectifAnnee2) {
                acc[rentreeScolaire.rentreeScolaire].push({
                  label: "Année 2",
                  value: rentreeScolaire.effectifAnnee2,
                });
              }
              if (rentreeScolaire.effectifAnnee3) {
                acc[rentreeScolaire.rentreeScolaire].push({
                  label: "Année 3",
                  value: rentreeScolaire.effectifAnnee3,
                });
              }
              return acc;
            },
            {} as Record<string, { label: string; value: number }[]>
          )}
        />
      ) : (
        <CounterChart />
      )}
    </DashboardCard>
  );
};
