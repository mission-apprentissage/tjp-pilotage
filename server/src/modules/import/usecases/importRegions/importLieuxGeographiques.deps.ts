import { Insertable } from "kysely";

import { DB, kdb } from "../../../../db/db";
import { rawDataRepository } from "../../repositories/rawData.repository";

const createRegions = async ({ data }: { data: Array<Insertable<DB["region"]>> }) => {
  await kdb
    .insertInto("region")
    .values(data)
    .onConflict((oc) => 
      oc.column("codeRegion").doUpdateSet(eb => ({
        libelleRegion: eb.ref("excluded.codeRegion"),
        codeRegion: eb.ref("excluded.codeRegion")
      }))
    )
    .execute();
};

const createAcademies = async ({ data }: { data: Array<Insertable<DB["academie"]>> }) => {
  await kdb
    .insertInto("academie")
    .values(data)
    .onConflict((oc) => 
      oc.column("codeAcademie").doUpdateSet(eb => {
        return {
          codeRegion: eb.ref("excluded.codeRegion"),
          codeAcademie: eb.ref("excluded.codeAcademie"),
          libelleAcademie: eb.ref("excluded.libelleAcademie")
        }
      })
    )
    .execute();
};

const createDepartements = async (
  { data }: { data: Array<Insertable<DB["departement"]>> }
) => {
  await kdb
    .insertInto("departement")
    .values(data)
    .onConflict((oc) => 
      oc.column("codeDepartement").doUpdateSet(eb => ({
        codeRegion: eb.ref("excluded.codeRegion"),
        codeAcademie: eb.ref("excluded.codeAcademie"),
        codeDepartement: eb.ref("excluded.codeDepartement"),
        libelleDepartement: eb.ref("excluded.libelleDepartement")
      }))
    )
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
