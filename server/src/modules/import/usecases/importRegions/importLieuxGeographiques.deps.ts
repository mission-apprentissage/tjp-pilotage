import { Insertable } from "kysely";

import { DB, kdb } from "../../../../db/db";
import { rawDataRepository } from "../../repositories/rawData.repository";

const createRegions = async ({ data }: { data: Array<Insertable<DB["region"]>> }) => {
  await kdb
    .insertInto("region")
    .values(data)
    .execute();
};

const createAcademies = async ({ data }: { data: Array<Insertable<DB["academie"]>> }) => {
  await kdb
    .insertInto("academie")
    .values(data)
    .execute();
};

const createDepartements = async (
  { data }: { data: Array<Insertable<DB["departement"]>> }
) => {
  await kdb
    .insertInto("departement")
    .values(data)
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
  createRegions,
  createAcademies,
  createDepartements,
  findDepartementAcademieRegions,
};
