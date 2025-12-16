/**
 * Importe les lieux géographiques : régions, académies et départements avec leurs relations.
 *
 * Fichiers rawData utilisés :
 * - "departements_academies_regions_" : données de géographie administrative (codeRegion, libelleRegion, codeAcademie, libelleAcademie, codeDepartement, libelleDepartement)
 *
 * Cette fonction :
 * 1. Récupère les correspondances département-académie-région depuis rawData type "departements_academies_regions_"
 * 2. Pour chaque ligne de ces données brutes de rawData :
 *  a. insère ou met à jour une ligne dans la table "region"
 *  b. Insère ou met à jour une ligne dans la table "academie" (si codeAcademie valide)
 *  c. Insère ou met à jour une ligne dans la table "departement" (si données complètes)
 *
 * Retourne le nombre total de régions, académies et départements importés.
 */

import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import type { Departements_academies_regions } from "@/modules/import/fileTypes/Departements_academies_regions";
import { streamIt } from "@/modules/import/utils/streamIt";
import { inject } from "@/utils/inject";

import { importRegionsDeps } from "./importLieuxGeographiques.deps";

export const [importLieuxGeographiques, importLieuxGeographiquesFactory] = inject(
  {
    region: importRegionsDeps.createRegions,
    academie: importRegionsDeps.createAcademies,
    departement: importRegionsDeps.createDepartements,
    findDepartementAcademieRegions: importRegionsDeps.findDepartementAcademieRegions,
  },
  (deps) => async () => {
    console.log(`Import des regions`);

    await streamIt(
      async (count) => deps.findDepartementAcademieRegions({ offset: count, limit: 20 }),
      async (item) => {
        const region = createRegionFromLine(item);
        await deps.region({ data: [region] });

        const academie = createAcademieFromLine(item);
        if (!academie) return;
        await deps.academie({ data: [academie] });

        const departement = createDepartementFromLine(item);
        if (!departement) return;
        await deps.departement({ data: [departement] });
      },
      { parallel: 20 }
    );

    console.log("Lieux géographiques ajoutés ou mis à jour\n");
  }
);

const createRegionFromLine = (data: Departements_academies_regions): Insertable<DB["region"]> => {
  return {
    codeRegion: data.codeRegion,
    libelleRegion: data.libelleRegion,
  };
};

const createAcademieFromLine = (data: Departements_academies_regions): Insertable<DB["academie"]> | undefined => {
  if (data.codeAcademie.length !== 2) return;
  return {
    codeAcademie: data.codeAcademie,
    codeRegion: data.codeRegion,
    libelleAcademie: data.libelleAcademie,
  };
};

const createDepartementFromLine = (data: Departements_academies_regions): Insertable<DB["departement"]> | undefined => {
  if (!data.codeDepartement || !data.libelleDepartement) return;
  return {
    codeRegion: data.codeRegion,
    codeAcademie: data.codeAcademie,
    libelleDepartement: data.libelleDepartement,
    codeDepartement: data.codeDepartement,
  };
};
