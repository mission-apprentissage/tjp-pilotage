import { Kysely, sql } from "kysely";

import { kdb } from "../db/db";

// https://www.notion.so/D-doublonner-les-CS-li-s-la-mise-jour-des-dipl-mes-du-4-07-2dd6d9f9790040ffa8dc43903f77063c?pvs=4#aaa14afb1e4a4079b48d1fc1427a9902
// codes temporaires : codes actuels
const correspondancesCFD: Record<string, string> = {
  "56122101": "56122103",
  "56122102": "56122105",
  "56124201": "56124201",
  "46122701": "46122703",
  "46131101": "46131101",
  "56134201": "56134201",
  "46125001": "46125002",
  "46125002": "46125003",
  "46122001": "46122001",
  "46131201": "46131201",
  "46133503": "46133503",
  "46132601": "46132601",
  "46133504": "46133504",
  "46133501": "46133501",
  "46133502": "46133502",
  "46133505": "46133505",
  "46125101": "46125122",
  "56122106": "56122112",
  "46122301": "46122306",
  "46123301": "46123304",
  "46125502": "46125509",
  "56122103": "56122107",
  "56122105": "56122109",
  "56122107": "56122111",
  "56122301": "56122304",
  "56122302": "56122307",
  "56122401": "56122405",
  "56122701": "56122706",
  "56123201": "56123204",
  "56123301": "56123307",
  "56125101": "56125118",
  "56133001": "56133002",
  "56133401": "56133411",
  "56133601": "56133605",
  "46122702": "46122704",
  "46123302": "46123306",
  "46125003": "46125004",
  "46125102": "46125123",
  "46125301": "46125308",
  "46125302": "46125309",
  "46125303": "46125310",
  "46125304": "46125311",
  "46125305": "46125312",
  "46125401": "46125406",
  "46125402": "46125407",
  "46125403": "46125408",
  "46122703": "46122705",
  "46125404": "46125409",
  "46125501": "46125508",
  "46133401": "46133412",
  "56122104": "56122113",
  "46125503": "46125510",
  "46133403": "46133414",
  "46133402": "46133413",
  "56123302": "56123308",
  "56123303": "56123309",
  "56122109": "56122114",
  "56123202": "56123205",
};

export const up = async (_db: Kysely<unknown>) => {
  let sqlQuery = "";
  Object.keys(correspondancesCFD).map(async (ancienCFD) => {
    const nouveauCFD = correspondancesCFD[ancienCFD];

    sqlQuery += `UPDATE demande SET cfd = '${nouveauCFD}' WHERE cfd = '${ancienCFD}';\n`;
    sqlQuery += `UPDATE intention SET cfd = '${nouveauCFD}' WHERE cfd = '${ancienCFD}';\n`;
  });

  // disable les triggers qui utilisent trop de mémoire sur des opérations massives
  await kdb.executeQuery(
    sql`
    ALTER TABLE demande DISABLE TRIGGER ALL;
    ALTER TABLE intention DISABLE TRIGGER ALL;
    `.compile(kdb)
  );
  await kdb.executeQuery(sql.raw(sqlQuery).compile(kdb));

  // enable les triggers
  await kdb.executeQuery(
    sql`
    ALTER TABLE demande ENABLE TRIGGER ALL;
    ALTER TABLE intention ENABLE TRIGGER ALL;
    `.compile(kdb)
  );

  await kdb.executeQuery(
    sql`
    REFRESH MATERIALIZED VIEW "latestDemandeView" WITH DATA;
    REFRESH MATERIALIZED VIEW "latestIntentionView" WITH DATA;
    REFRESH MATERIALIZED VIEW "demandeIntentionView" WITH DATA;
    REFRESH MATERIALIZED VIEW "latestDemandeIntentionView" WITH DATA;
    `.compile(kdb)
  );
};

export const down = async (_db: Kysely<unknown>) => {
  let sqlQuery = "";
  Object.keys(correspondancesCFD).map(async (ancienCFD) => {
    const nouveauCFD = correspondancesCFD[ancienCFD];

    sqlQuery += `UPDATE demande SET cfd = '${ancienCFD}' WHERE cfd = '${nouveauCFD}';\n`;
    sqlQuery += `UPDATE intention SET cfd = '${ancienCFD}' WHERE cfd = '${nouveauCFD}';\n`;
  });

  // disable les triggers qui utilisent trop de mémoire sur des opérations massives
  await kdb.executeQuery(
    sql`
    ALTER TABLE demande DISABLE TRIGGER ALL;
    ALTER TABLE intention DISABLE TRIGGER ALL;
    `.compile(kdb)
  );
  await kdb.executeQuery(sql.raw(sqlQuery).compile(kdb));

  // enable les triggers
  await kdb.executeQuery(
    sql`
    ALTER TABLE demande ENABLE TRIGGER ALL;
    ALTER TABLE intention ENABLE TRIGGER ALL;
    `.compile(kdb)
  );

  await kdb.executeQuery(
    sql`
    REFRESH MATERIALIZED VIEW "latestDemandeView" WITH DATA;
    REFRESH MATERIALIZED VIEW "latestIntentionView" WITH DATA;
    REFRESH MATERIALIZED VIEW "demandeIntentionView" WITH DATA;
    REFRESH MATERIALIZED VIEW "latestDemandeIntentionView" WITH DATA;
    `.compile(kdb)
  );
};
