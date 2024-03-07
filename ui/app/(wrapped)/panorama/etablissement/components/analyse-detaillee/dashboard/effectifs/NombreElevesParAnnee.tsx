import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import { TooltipIcon } from "@/components/TooltipIcon";

import { DashboardCard } from "../../../DashboardCard";
import { CounterChart } from "../../components/CounterChart";
import { HorizontalBarChart } from "../../components/HorizontalBarChart";
import { ChiffresEntreeOffre } from "../../types";

export const NombreElevesParAnnee = ({
  chiffresEntreeOffre,
}: {
  chiffresEntreeOffre?: ChiffresEntreeOffre;
}) => {
  const { openGlossaire } = useGlossaireContext();
  const checkDataAvailability = (chiffresEntreeOffre: ChiffresEntreeOffre) => {
    return (
      Object.values(chiffresEntreeOffre).findIndex(
        (value) =>
          value.effectifAnnee1 || value.effectifAnnee2 || value.effectifAnnee3
      ) !== -1
    );
  };
  return (
    <DashboardCard
      label="Nombre d'élèves par année (Constat de rentrée 2023)"
      tooltip={
        <TooltipIcon
          ml="1"
          label="Nombre d'élèves"
          onClick={() => openGlossaire("effectifs")}
        />
      }
    >
      {chiffresEntreeOffre && checkDataAvailability(chiffresEntreeOffre) ? (
        <HorizontalBarChart
          data={Object.values(chiffresEntreeOffre).reduce(
            (acc, rentreeScolaire) => {
              acc[rentreeScolaire.rentreeScolaire] = [];
              if (
                rentreeScolaire.effectifs &&
                rentreeScolaire.effectifs.length >= 1
              ) {
                acc[rentreeScolaire.rentreeScolaire].push({
                  label: "Année 1",
                  value: rentreeScolaire.effectifAnnee1 ?? 0,
                });
              }
              if (
                rentreeScolaire.effectifs &&
                rentreeScolaire.effectifs.length >= 2
              ) {
                acc[rentreeScolaire.rentreeScolaire].push({
                  label: "Année 2",
                  value: rentreeScolaire.effectifAnnee2 ?? 0,
                });
              }
              if (
                rentreeScolaire.effectifs &&
                rentreeScolaire.effectifs.length >= 3
              ) {
                acc[rentreeScolaire.rentreeScolaire].push({
                  label: "Année 3",
                  value: rentreeScolaire.effectifAnnee3 ?? 0,
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
