import { db, pool } from "../../../../db/zapatos";
import { formatEtablissement } from "../../adapters/formatEtablissement";
import { formatFormation } from "../../adapters/formatFormation";
import { Etablissement } from "../../entities/Etablissement";
import { Formation } from "../../entities/Formation";
import {
  FormationEtablissement,
  IndicateurSortie,
} from "../../entities/FormationEtablissement";
import { IndicateurEtablissement } from "../../entities/IndicateurEtablissement";
import { Affelnet2ndeLine } from "../../files/Affelnet2ndeLine";
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
  return db
    .upsert("indicateurSortie", indicateurSortie, [
      "formationEtablissementId",
      "millesimeSortie",
    ])
    .run(pool);
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

const findAffelnet2ndes = async ({ mefStat11 }: { mefStat11: string }) =>
  (
    await db
      .select("rawData", {
        type: "affelnet2nde",
        data: db.sql`${db.self}@>${db.param({
          "Code spécialité": mefStat11,
        })}`,
      })
      .run(pool)
  ).map((item) => item.data as Affelnet2ndeLine);

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

export const dependencies = {
  createIndicateurSortie,
  upsertIndicateurEtablissement,
  findFormations,
  createFormationEtablissement,
  findAffelnet2ndes,
  findNMefs,
  findLyceeACCE,
  findEtablissement,
  createEtablissement,
};
