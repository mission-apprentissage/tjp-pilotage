import { ExpressionBuilder } from "kysely";

import { DB } from "../../../db/schema";

export const notPerimetreIJRegion = (eb: ExpressionBuilder<DB, "region">) => {
  return eb("region.codeRegion", "not in", ["00"]);
};

export const notPerimetreIJDepartement = (
  eb: ExpressionBuilder<DB, "departement">
) => {
  return eb.and([
    eb("departement.codeRegion", "not in", ["00"]),
    eb("departement.codeDepartement", "not in", [
      "986",
      "975",
      "988",
      "987",
      "990",
    ]),
  ]);
};

export const notPerimetreIJAcademie = (
  eb: ExpressionBuilder<DB, "academie">
) => {
  return eb.and([
    eb("academie.codeRegion", "not in", ["00", "99"]),
    eb("academie.codeAcademie", "not in", [
      "00",
      "40",
      "41",
      "42",
      "44",
      "54",
      "61",
      "62",
      "63",
      "66",
      "67",
      "91",
      "99",
    ]),
  ]);
};

export const notPerimetreIJIndicateurRegionSortie = (
  eb: ExpressionBuilder<DB, "indicateurRegionSortie">
) => {
  return eb("indicateurRegionSortie.codeRegion", "not in", ["00"]);
};

export const notPerimetreIJEtablissement = (
  eb: ExpressionBuilder<DB, "etablissement">
) => {
  return eb.and([
    eb("etablissement.codeRegion", "not in", ["00", "99"]),
    eb("etablissement.codeAcademie", "not in", [
      "00",
      "40",
      "41",
      "42",
      "44",
      "54",
      "61",
      "62",
      "63",
      "66",
      "67",
      "91",
      "99",
    ]),
    eb("etablissement.codeDepartement", "not in", [
      "986",
      "975",
      "988",
      "987",
      "990",
    ]),
  ]);
};
