import { Insertable } from "kysely";

import { DB } from "../../../../db/db";
import { Departements_academies_regions } from "../../fileTypes/Departements_academies_regions";
import { streamIt } from "../../utils/streamIt";
import { importRegionsDeps } from "./importLieuxGeographiques.deps";

export const importLieuxGeographiquesFactory =
  ({
    createRegion = importRegionsDeps.createRegion,
    createAcademie = importRegionsDeps.createAcademie,
    createDepartement = importRegionsDeps.createDepartement,
    findDepartementAcademieRegions = importRegionsDeps.findDepartementAcademieRegions,
  }) =>
  async () => {
    console.log(`Import des regions`);

    await streamIt(
      (count) => findDepartementAcademieRegions({ offset: count, limit: 20 }),
      async (item) => {
        const region = createRegionFromLine(item);
        await createRegion(region);

        const academie = createAcademieFromLine(item);
        if (!academie) return;
        await createAcademie(academie);

        const departement = createDepartementFromLine(item);
        if (!departement) return;
        await createDepartement(departement);
      }
    );

    console.log("Lieux géographiques ajoutés ou mis à jour\n");
  };

export const importLieuxGeographiques = importLieuxGeographiquesFactory({});

const createRegionFromLine = (
  data: Departements_academies_regions
): Insertable<DB["region"]> => {
  return {
    codeRegion: data.codeRegion,
    libelleRegion: data.libelleRegion,
  };
};

const createAcademieFromLine = (
  data: Departements_academies_regions
): Insertable<DB["academie"]> | undefined => {
  if (data.codeAcademie.length !== 2) return;
  return {
    codeAcademie: data.codeAcademie,
    codeRegion: data.codeRegion,
    libelleAcademie: data.libelleAcademie,
  };
};

const createDepartementFromLine = (
  data: Departements_academies_regions
): Insertable<DB["departement"]> | undefined => {
  if (!data.codeDepartement || !data.libelleDepartement) return;
  return {
    codeRegion: data.codeRegion,
    codeAcademie: data.codeAcademie,
    libelleDepartement: data.libelleDepartement,
    codeDepartement: data.codeDepartement,
  };
};
