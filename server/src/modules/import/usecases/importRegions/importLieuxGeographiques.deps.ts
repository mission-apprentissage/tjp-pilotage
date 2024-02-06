import { Insertable } from "kysely";

import { DB, kdb } from "../../../../db/db";
import { rawDataRepository } from "../../repositories/rawData.repository";

const createRegion = async (region: Insertable<DB["region"]>) => {
  await kdb
    .insertInto("region")
    .values(region)
    .onConflict((oc) => oc.column("codeRegion").doUpdateSet(region))
    .execute();
};

const createAcademie = async (academie: Insertable<DB["academie"]>) => {
  await kdb
    .insertInto("academie")
    .values(academie)
    .onConflict((oc) => oc.column("codeAcademie").doUpdateSet(academie))
    .execute();
};

const createDepartement = async (
  departement: Insertable<DB["departement"]>
) => {
  await kdb
    .insertInto("departement")
    .values(departement)
    .onConflict((oc) => oc.column("codeDepartement").doUpdateSet(departement))
    .execute();
};

const findDepartementAcademieRegions = async ({
  offset,
  limit,
}: {
  offset?: number;
  limit?: number;
}) =>
  rawDataRepository.findRawDatas({
    type: "departements_academies_regions",
    offset,
    limit,
  });

export const importRegionsDeps = {
  createRegion,
  createAcademie,
  createDepartement,
  findDepartementAcademieRegions,
};
