import { db, pool } from "../../../../db/zapatos";
import { cleanNull } from "../../../../utils/noNull";
import { formatFormation } from "../../adapters/formatFormation";
import { FamilleMetier } from "../../entities/FamilleMetier";
import { Formation } from "../../entities/Formation";
import { Cab_bre_division_effectifs_par_etab_mefst11 } from "../../files/Cab-nbre_division_effectifs_par_etab_mefst11";
import { NMefLine } from "../../files/NMef";

const findContratRentrees = async ({ mefStat11 }: { mefStat11: string }) => {
  return (
    await db
      .select("rawData", {
        type: "Cab-nbre_division_effectifs_par_etab_mefst11",
        data: db.sql`${db.self}@>${db.param({
          "Mef Bcp 11": mefStat11,
        })}`,
      })
      .run(pool)
  ).map((item) => item.data as Cab_bre_division_effectifs_par_etab_mefst11);
};

const findNMefs = async ({ cfd }: { cfd: string }) =>
  (
    await db
      .select(
        "rawData",
        {
          type: "nMef",
          data: db.sql`${db.self}@>${db.param({
            FORMATION_DIPLOME: cfd,
          })}`,
        },
        { order: { by: "id", direction: "ASC" } }
      )
      .run(pool)
  ).map((item) => item.data as NMefLine);

const findFormations = async ({
  offset,
  limit,
}: {
  offset?: number;
  limit?: number;
}): Promise<Formation[]> =>
  (await db.select("formation", {}, { offset, limit }).run(pool)).map(
    formatFormation
  );

const findFamilleMetier = async ({
  cfdSpecialite,
}: {
  cfdSpecialite: string;
}): Promise<FamilleMetier | undefined> => {
  const result = await db
    .selectOne("familleMetier", { cfdSpecialite })
    .run(pool);

  return result ? cleanNull(result) : undefined;
};

const cacheIj = async ({
  data,
  uai,
  millesime,
}: {
  data: object;
  uai: string;
  millesime: string;
}) => {
  await db
    .insert("rawData", { type: "ij", data: { ...data, uai, millesime } })
    .run(pool);
};

const clearIjCache = async () => {
  await db
    .deletes("rawData", {
      type: "ij",
    })
    .run(pool);
};

export const dependencies = {
  findFamilleMetier,
  findFormations,
  findContratRentrees,
  findNMefs,
  cacheIj,
  clearIjCache,
};
