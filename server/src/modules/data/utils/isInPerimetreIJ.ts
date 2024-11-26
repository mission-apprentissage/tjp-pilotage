import type { ExpressionBuilder } from "kysely";

import type { DB } from "@/db/db";

export const isInPerimetreIJRegion = (eb: ExpressionBuilder<DB, "region">) => {
  return eb("region.codeRegion", "not in", ["00", "99"]);
};

export const isInPerimetreIJDepartement = (eb: ExpressionBuilder<DB, "departement">) => {
  return eb.and([
    eb("departement.codeRegion", "not in", ["00"]),
    eb("departement.codeDepartement", "not in", ["986", "975", "988", "987", "990"]),
  ]);
};

export const isInPerimetreIJAcademie = (eb: ExpressionBuilder<DB, "academie">) => {
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

export const isInPerimetreIJIndicateurRegionSortie = (eb: ExpressionBuilder<DB, "indicateurRegionSortie">) => {
  return eb("indicateurRegionSortie.codeRegion", "not in", ["00"]);
};

export const isInPerimetreIJEtablissement = (eb: ExpressionBuilder<DB, "etablissement">) => {
  return eb
    .and([
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
      eb("etablissement.codeDepartement", "not in", ["986", "975", "988", "987", "990"]),
    ])
    .or("etablissement.codeRegion", "is", null)
    .or("etablissement.codeAcademie", "is", null)
    .or("etablissement.codeDepartement", "is", null);
};

export const isInPerimetreIJDataEtablissement = (eb: ExpressionBuilder<DB, "dataEtablissement">) => {
  return eb
    .and([
      eb("dataEtablissement.codeRegion", "not in", ["00", "99"]),
      eb("dataEtablissement.codeAcademie", "not in", [
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
      eb("dataEtablissement.codeDepartement", "not in", ["986", "975", "988", "987", "990"]),
    ])
    .or("dataEtablissement.codeRegion", "is", null)
    .or("dataEtablissement.codeAcademie", "is", null)
    .or("dataEtablissement.codeDepartement", "is", null);
};
