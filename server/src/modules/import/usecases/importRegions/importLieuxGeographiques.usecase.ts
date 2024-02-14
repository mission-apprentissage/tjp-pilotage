import { inject } from "injecti";
import { Insertable } from "kysely";

import { DB } from "../../../../db/db";
import { Departements_academies_regions } from "../../fileTypes/Departements_academies_regions";
import batchCreate from "../../utils/batchCreate";
import { streamIt } from "../../utils/streamIt";
import { importRegionsDeps } from "./importLieuxGeographiques.deps";

export const [importLieuxGeographiques, importLieuxGeographiquesFactory] =
  inject(
    {
      region: batchCreate(importRegionsDeps.createRegions),
      academie: batchCreate(importRegionsDeps.createAcademies),
      departement: batchCreate(importRegionsDeps.createDepartements),
      findDepartementAcademieRegions:
        importRegionsDeps.findDepartementAcademieRegions,
    },
    (deps) => async () => {
      console.log(`Import des regions`);

      await streamIt(
        (count) =>
          deps.findDepartementAcademieRegions({ offset: count, limit: 20 }),
        async (item) => {
          const region = createRegionFromLine(item);
          await deps.region.create({ data: region });

          const academie = createAcademieFromLine(item);
          if (!academie) return;
          await deps.academie.create({ data: academie });

          const departement = createDepartementFromLine(item);
          if (!departement) return;
          await deps.departement.create({ data: departement });
        },
        { parallel: 20 },
        async () => {
          await deps.region.flush();
          await deps.academie.flush();
          await deps.departement.flush();
        }
      );

      console.log("Lieux géographiques ajoutés ou mis à jour\n");
    }
  );

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
