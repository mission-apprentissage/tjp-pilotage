import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";
import { rawDataRepository } from "@/modules/import/repositories/rawData.repository";

const createRegions = async ({ data }: { data: Array<Insertable<DB["region"]>> }) => {
  await getKbdClient()
    .insertInto("region")
    .values(data)
    .onConflict((oc) =>
      oc.column("codeRegion").doUpdateSet((eb) => ({
        libelleRegion: eb.ref("excluded.libelleRegion"),
        codeRegion: eb.ref("excluded.codeRegion"),
      })),
    )
    .execute();
};

const createAcademies = async ({ data }: { data: Array<Insertable<DB["academie"]>> }) => {
  await getKbdClient()
    .insertInto("academie")
    .values(data)
    .onConflict((oc) =>
      oc.column("codeAcademie").doUpdateSet((eb) => {
        return {
          codeRegion: eb.ref("excluded.codeRegion"),
          codeAcademie: eb.ref("excluded.codeAcademie"),
          libelleAcademie: eb.ref("excluded.libelleAcademie"),
        };
      }),
    )
    .execute();
};

const createDepartements = async ({ data }: { data: Array<Insertable<DB["departement"]>> }) => {
  await getKbdClient()
    .insertInto("departement")
    .values(data)
    .onConflict((oc) =>
      oc.column("codeDepartement").doUpdateSet((eb) => ({
        codeRegion: eb.ref("excluded.codeRegion"),
        codeAcademie: eb.ref("excluded.codeAcademie"),
        codeDepartement: eb.ref("excluded.codeDepartement"),
        libelleDepartement: eb.ref("excluded.libelleDepartement"),
      })),
    )
    .execute();
};

const findDepartementAcademieRegions = async ({ offset, limit }: { offset?: number; limit?: number }) =>
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
