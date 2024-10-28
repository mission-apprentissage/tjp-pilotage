// @ts-nocheck -- TODO

import { Badge } from "@chakra-ui/react";

import { CounterChart } from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/components/CounterChart";
import { HorizontalBarChart } from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/components/HorizontalBarChart";
import type { ChiffresEntreeOffre } from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/types";
import { DashboardCard } from "@/app/(wrapped)/panorama/etablissement/components/DashboardCard";
import { GlossaireShortcut } from "@/components/GlossaireShortcut";

export const NombreElevesParAnnee = ({ chiffresEntreeOffre }: { chiffresEntreeOffre?: ChiffresEntreeOffre }) => {
  const checkDataAvailability = (): boolean => {
    if (chiffresEntreeOffre) {
      return (
        Object.values(chiffresEntreeOffre).findIndex(
          (value) => value.effectifAnnee1 || value.effectifAnnee2 || value.effectifAnnee3
        ) !== -1
      );
    }
    return false;
  };

  const getHorizontalBarChartData = () => {
    if (chiffresEntreeOffre) {
      return Object.values(chiffresEntreeOffre ?? {}).reduce(
        (acc, rentreeScolaire) => {
          acc[rentreeScolaire.rentreeScolaire] = [];
          if (rentreeScolaire.effectifs && rentreeScolaire.effectifs.length >= 1) {
            acc[rentreeScolaire.rentreeScolaire].push({
              label: "Année 1",
              value: rentreeScolaire.effectifAnnee1 ?? 0,
            });
          }
          if (rentreeScolaire.effectifs && rentreeScolaire.effectifs.length >= 2) {
            acc[rentreeScolaire.rentreeScolaire].push({
              label: "Année 2",
              value: rentreeScolaire.effectifAnnee2 ?? 0,
            });
          }
          if (rentreeScolaire.effectifs && rentreeScolaire.effectifs.length >= 3) {
            acc[rentreeScolaire.rentreeScolaire].push({
              label: "Année 3",
              value: rentreeScolaire.effectifAnnee3 ?? 0,
            });
          }
          return acc;
        },
        {} as Record<string, { label: string; value: number }[]>
      );
    }
    return {};
  };

  return (
    <DashboardCard
      label="Nombre d'élèves par année (Constat de rentrée 2023)"
      tooltip={<GlossaireShortcut tooltip="Nombre d'élèves" glossaireEntryKey="nombre-deleves" />}
      badge={
        <Badge variant="lavander" size={"xs"}>
          Étab.
        </Badge>
      }
    >
      {checkDataAvailability() ? (
        <HorizontalBarChart
          title="Nombre d'élèves par année (Constat de rentrée 2023)"
          // @ts-expect-error TODO
          data={getHorizontalBarChartData()}
        />
      ) : (
        <CounterChart />
      )}
    </DashboardCard>
  );
};
