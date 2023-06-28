import { Insertable } from "kysely";

import { kdb } from "../../../../db/db";
import { DB, JsonValue } from "../../../../db/schema";
import { cleanNull } from "../../../../utils/noNull";
import { rawDataRepository } from "../../repositories/rawData.repository";

const createFormationEtablissement = async (
  formationEtablissement: Insertable<DB["formationEtablissement"]>
) => {
  return await kdb
    .insertInto("formationEtablissement")
    .values(formationEtablissement)
    .onConflict((oc) =>
      oc
        .column("UAI")
        .column("cfd")
        .column("dispositifId")
        .column("voie")
        .doUpdateSet(formationEtablissement)
    )
    .returningAll()
    .executeTakeFirstOrThrow();
};

const createIndicateurSortie = async (
  indicateurSortie: Insertable<DB["indicateurSortie"]>
) => {
  await kdb
    .insertInto("indicateurSortie")
    .values(indicateurSortie)
    .onConflict((oc) =>
      oc
        .column("formationEtablissementId")
        .column("millesimeSortie")
        .doUpdateSet(indicateurSortie)
    )
    .execute();
};

const createIndicateurEntree = async (
  indicateurEntree: Omit<
    Insertable<DB["indicateurEntree"]>,
    "effectifs" | "capacites" | "premiersVoeux"
  > & {
    effectifs: JsonValue;
    capacites: JsonValue;
    premiersVoeux: JsonValue;
  }
) => {
  const formatted = {
    ...indicateurEntree,
    effectifs: JSON.stringify(indicateurEntree.effectifs),
    capacites: JSON.stringify(indicateurEntree.capacites),
    premiersVoeux: JSON.stringify(indicateurEntree.premiersVoeux),
  } as const;
  await kdb
    .insertInto("indicateurEntree")
    .values(formatted)
    .onConflict((oc) =>
      oc
        .column("formationEtablissementId")
        .column("rentreeScolaire")
        .doUpdateSet(formatted)
    )
    .execute();
};

const createEtablissement = async (
  etablissement: Insertable<DB["etablissement"]>
) => {
  const retu = await kdb
    .insertInto("etablissement")
    .values(etablissement)
    .onConflict((oc) => oc.column("UAI").doUpdateSet(etablissement))
    .returningAll()
    .executeTakeFirstOrThrow();
  return cleanNull(retu);
};

const findEtablissement = async ({ UAI }: { UAI: string }) => {
  const etablissement = await kdb
    .selectFrom("etablissement")
    .selectAll()
    .where("UAI", "=", UAI)
    .executeTakeFirst();
  return etablissement && cleanNull(etablissement);
};

const findContratRentrees = async ({ mefStat11 }: { mefStat11: string }) => {
  return rawDataRepository.findRawDatas({
    type: "Cab-nbre_division_effectifs_par_etab_mefst11",
    filter: { "Mef Bcp 11": mefStat11 },
  });
};

const findLyceeACCE = async ({ uai }: { uai: string }) => {
  return rawDataRepository.findRawData({
    type: "lyceesACCE",
    filter: { numero_uai: uai },
  });
};

const findDepartement = async ({
  codeDepartement,
}: {
  codeDepartement: string;
}) => {
  return kdb
    .selectFrom("departement")
    .selectAll("departement")
    .where("codeDepartement", "=", codeDepartement)
    .executeTakeFirst();
};

const findNMefs = async ({ cfd }: { cfd: string }) => {
  return rawDataRepository.findRawDatas({
    type: "nMef",
    filter: { FORMATION_DIPLOME: cfd },
  });
};

const findFormations = async ({
  offset,
  limit,
}: {
  offset?: number;
  limit?: number;
}) => {
  return (
    await kdb
      .selectFrom("formation")
      .selectAll("formation")
      .offset(offset ?? 0)
      .limit(limit ?? 100000000)
      .execute()
  ).map(cleanNull);
};

const upsertIndicateurEtablissement = async (
  indicateurEtablissement: Insertable<DB["indicateurEtablissement"]>
) => {
  await kdb
    .insertInto("indicateurEtablissement")
    .values(indicateurEtablissement)
    .onConflict((oc) =>
      oc.column("UAI").column("millesime").doUpdateSet(indicateurEtablissement)
    )
    .execute();
};

const findFamilleMetier = async ({
  cfdSpecialite,
}: {
  cfdSpecialite: string;
}) => {
  const result = await kdb
    .selectFrom("familleMetier")
    .selectAll("familleMetier")
    .where("cfdSpecialite", "=", cfdSpecialite)
    .executeTakeFirst();
  return result && cleanNull(result);
};

const getUaiData = async ({
  uai,
  millesime,
}: {
  uai: string;
  millesime: string;
}) => {
  return rawDataRepository.findRawData({
    type: "ij",
    //@ts-ignore
    filter: { uai, millesime },
  });
};

export const dependencies = {
  findFamilleMetier,
  getUaiData,
  findDepartement,
  createIndicateurSortie,
  createIndicateurEntree,
  upsertIndicateurEtablissement,
  findFormations,
  createFormationEtablissement,
  findContratRentrees,
  findNMefs,
  findLyceeACCE,
  findEtablissement,
  createEtablissement,
};
