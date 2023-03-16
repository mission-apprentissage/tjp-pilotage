import { db, pool } from "../../../../db/zapatos";
import { cleanNull } from "../../../../utils/noNull";
import { formatEtablissement } from "../../adapters/formatEtablissement";
import { formatFormation } from "../../adapters/formatFormation";
import { Departement } from "../../entities/Departement";
import { Etablissement } from "../../entities/Etablissement";
import { FamilleMetier } from "../../entities/FamilleMetier";
import { Formation } from "../../entities/Formation";
import { FormationEtablissement } from "../../entities/FormationEtablissement";
import { IndicateurEntree } from "../../entities/IndicateurEntree";
import { IndicateurEtablissement } from "../../entities/IndicateurEtablissement";
import { IndicateurSortie } from "../../entities/IndicateurSortie";
import { Cab_bre_division_effectifs_par_etab_mefst11 } from "../../files/Cab-nbre_division_effectifs_par_etab_mefst11";
import { LyceesACCELine } from "../../files/LyceesACCELine";
import { NMefLine } from "../../files/NMef";

const createFormationEtablissement = async (
  formationEtablissement: Omit<FormationEtablissement, "id">
): Promise<FormationEtablissement> => {
  return db
    .upsert("formationEtablissement", formationEtablissement, [
      "UAI",
      "cfd",
      "dispositifId",
      "voie",
    ])
    .run(pool);
};

const createIndicateurSortie = async (indicateurSortie: IndicateurSortie[]) => {
  db.upsert("indicateurSortie", indicateurSortie, [
    "formationEtablissementId",
    "millesimeSortie",
  ]).run(pool);
};

const createIndicateurEntree = async (indicateurEntree: IndicateurEntree[]) => {
  db.upsert("indicateurEntree", indicateurEntree, [
    "formationEtablissementId",
    "millesimeEntree",
  ]).run(pool);
};

const createEtablissement = async (
  etablissement: Omit<Etablissement, "id">
): Promise<Etablissement> => {
  const dbEtablissement = await db
    .upsert("etablissement", etablissement, "UAI")
    .run(pool);
  return formatEtablissement(dbEtablissement);
};

const findEtablissement = async ({
  UAI,
}: {
  UAI: string;
}): Promise<Etablissement | undefined> => {
  const etablissement = await db.selectOne("etablissement", { UAI }).run(pool);
  return etablissement && formatEtablissement(etablissement);
};

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

const findLyceeACCE = async ({ uai }: { uai: string }) =>
  (
    await db
      .selectOne("rawData", {
        type: "lyceesACCE",
        data: db.sql`${db.self}@>${db.param({
          numero_uai: uai,
        })}`,
      })
      .run(pool)
  )?.data as LyceesACCELine | undefined;

const findDepartement = async ({
  codeDepartement,
}: {
  codeDepartement: string;
}): Promise<Departement | undefined> =>
  await db.selectOne("departement", { codeDepartement }).run(pool);

const findNMefs = async ({ cfd }: { cfd: string }) =>
  (
    await db
      .select("rawData", {
        type: "nMef",
        data: db.sql`${db.self}@>${db.param({
          FORMATION_DIPLOME: cfd,
        })}`,
      })
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

const upsertIndicateurEtablissement = async (
  indicateurEtablissement: IndicateurEtablissement
) => {
  await db
    .upsert("indicateurEtablissement", indicateurEtablissement, [
      "UAI",
      "millesime",
    ])
    .run(pool);
};

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

export const dependencies = {
  findFamilleMetier,
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
