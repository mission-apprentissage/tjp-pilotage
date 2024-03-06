import { ExpressionBuilder, expressionBuilder, sql } from "kysely";
import { CURRENT_RENTREE } from "shared";
import { MILLESIMES_IJ_ETAB } from "shared/time/millesimes";

import { kdb } from "../../../../../db/db";
import { DB } from "../../../../../db/schema";
import { cleanNull } from "../../../../../utils/noNull";

const selectNumerateurPoursuite = (eb: ExpressionBuilder<DB, keyof DB>) =>
  eb.fn.sum<number>((s) =>
    s
      .case()
      .when(
        eb.and([
          eb("effectifSortie", ">=", sql<number>`1`),
          eb("nbPoursuiteEtudes", ">=", sql<number>`0`),
        ])
      )
      .then(s.ref("nbPoursuiteEtudes"))
      .end()
  );

const selectDenominateurPoursuite = (eb: ExpressionBuilder<DB, keyof DB>) =>
  eb.fn.sum<number>((s) =>
    s
      .case()
      .when(
        eb.and([
          eb("effectifSortie", ">=", sql<number>`1`),
          eb("nbPoursuiteEtudes", ">=", sql<number>`0`),
        ])
      )
      .then(s.ref("effectifSortie"))
      .end()
  );

const selectNumerateurEmploi = (eb: ExpressionBuilder<DB, keyof DB>) =>
  eb.fn.sum<number>((s) =>
    s
      .case()
      .when(
        eb.and([
          eb("nbSortants", ">=", sql<number>`1`),
          eb("nbInsertion6mois", ">=", sql<number>`0`),
        ])
      )
      .then(s.ref("nbInsertion6mois"))
      .end()
  );

const selectDenominateurEmploi = (eb: ExpressionBuilder<DB, keyof DB>) =>
  eb.fn.sum<number>((s) =>
    s
      .case()
      .when(
        eb.and([
          eb("nbSortants", ">=", sql<number>`1`),
          eb("nbInsertion6mois", ">=", sql<number>`0`),
        ])
      )
      .then(s.ref("nbSortants"))
      .end()
  );

const selectNumerateurDevenir = (eb: ExpressionBuilder<DB, keyof DB>) =>
  eb.fn.sum<number>((s) =>
    s
      .case()
      .when(
        eb.and([
          eb("effectifSortie", ">=", sql<number>`1`),
          eb("nbPoursuiteEtudes", ">=", sql<number>`0`),
          eb("nbInsertion6mois", ">=", sql<number>`0`),
        ])
      )
      .then(s.ref("effectifSortie"))
      .end()
  );

const selectDenominateurDevenir = (eb: ExpressionBuilder<DB, keyof DB>) =>
  eb.fn.sum<number>((s) =>
    s
      .case()
      .when(
        eb.and([
          eb("effectifSortie", ">=", sql<number>`1`),
          eb("nbPoursuiteEtudes", ">=", sql<number>`0`),
          eb("nbInsertion6mois", ">=", sql<number>`0`),
        ])
      )
      .then(s.ref("effectifSortie"))
      .end()
  );

const selectNbOffreTauxPoursuites = (eb: ExpressionBuilder<DB, keyof DB>) =>
  eb.fn.count((c) =>
    c
      .case()
      .when(
        eb.and([
          eb("effectifSortie", ">=", sql<number>`1`),
          eb("nbPoursuiteEtudes", ">=", sql<number>`0`),
        ])
      )
      .then(
        sql`${eb.ref("UAI")} || ${eb.ref("cfd")} || coalesce(${eb.ref(
          "dispositifId"
        )},'')`
      )
      .end()
  );

const selectNbOffresTauxEmploi6mois = (eb: ExpressionBuilder<DB, keyof DB>) =>
  eb.fn.count((c) =>
    c
      .case()
      .when(
        eb.and([
          eb("nbSortants", ">=", sql<number>`1`),
          eb("nbInsertion6mois", ">=", sql<number>`0`),
        ])
      )
      .then(
        sql`${eb.ref("UAI")} || ${eb.ref("cfd")} || coalesce(${eb.ref(
          "dispositifId"
        )},'')`
      )
      .end()
  );

const selectNbOffresTauxDevenir = (eb: ExpressionBuilder<DB, keyof DB>) =>
  eb.fn.count((c) =>
    c
      .case()
      .when(
        eb.and([
          eb("effectifSortie", ">=", sql<number>`1`),
          eb("nbPoursuiteEtudes", ">=", sql<number>`0`),
          eb("nbInsertion6mois", ">=", sql<number>`0`),
        ])
      )
      .then(
        sql`${eb.ref("UAI")} || ${eb.ref("cfd")} || coalesce(${eb.ref(
          "dispositifId"
        )},'')`
      )
      .end()
  );

const selectNbOffresScolaire = (eb: ExpressionBuilder<DB, keyof DB>) =>
  eb.fn.count(
    sql`${eb.ref("UAI")} || ${eb.ref("cfd")} || coalesce(${eb.ref(
      "dispositifId"
    )},'')`
  );

const tauxIJSubQuery = ({
  uai,
  millesime,
  rentreeScolaire,
}: {
  uai: string;
  millesime: string[];
  rentreeScolaire: string;
}) =>
  expressionBuilder<DB, keyof DB>()
    .selectFrom("formationEtablissement")
    .innerJoin(
      "indicateurEntree",
      "indicateurEntree.formationEtablissementId",
      "formationEtablissement.id"
    )
    .leftJoin(
      "indicateurSortie",
      "indicateurSortie.formationEtablissementId",
      "formationEtablissement.id"
    )
    .where("millesimeSortie", "in", millesime)
    .where("voie", "=", "scolaire")
    .where("UAI", "=", uai)
    .where("rentreeScolaire", "=", rentreeScolaire)
    .groupBy(["UAI", "rentreeScolaire", "millesimeSortie", "voie"])
    .select((eb) => [
      "UAI",
      "voie",
      "rentreeScolaire",
      "millesimeSortie",
      selectNumerateurPoursuite(eb).as("numerateurPoursuite"),
      selectDenominateurPoursuite(eb).as("denominateurPoursuite"),
      selectNumerateurEmploi(eb).as("numerateurEmploi"),
      selectDenominateurEmploi(eb).as("denominateurEmploi"),
      selectNumerateurDevenir(eb).as("numerateurDevenir"),
      selectDenominateurDevenir(eb).as("denominateurDevenir"),
      selectNbOffreTauxPoursuites(eb).as("nbOffresTauxPoursuite"),
      selectNbOffresTauxEmploi6mois(eb).as("nbOffresTauxEmploi6mois"),
      selectNbOffresTauxDevenir(eb).as("nbOffresTauxDevenir"),
      selectNbOffresScolaire(eb).as("nbOffresScolaire"),
    ]);

export const getTauxIJ = ({
  uai,
  rentreeScolaire = CURRENT_RENTREE,
  millesime = MILLESIMES_IJ_ETAB,
}: {
  uai: string;
  rentreeScolaire?: string;
  millesime?: string[];
}) =>
  kdb
    .selectFrom(
      tauxIJSubQuery({ uai, millesime, rentreeScolaire }).as("tauxIJ")
    )
    .select((eb) => [
      eb.ref("UAI").as("uai"),
      "voie",
      "rentreeScolaire",
      "millesimeSortie",
      sql<number>`100 * ${eb.ref("numerateurPoursuite")}::float/${eb.ref(
        "denominateurPoursuite"
      )}::float`.as("tauxPoursuite"),
      sql<number>`100 * ${eb.ref("numerateurEmploi")}::float/${eb.ref(
        "denominateurEmploi"
      )}::float`.as("tauxEmploi6mois"),
      sql<number>`100 * (${eb.ref("numerateurPoursuite")} + ${eb.ref(
        "numerateurEmploi"
      )})::float/${eb.ref("denominateurDevenir")}::float`.as("tauxDevenir"),
    ])
    .orderBy(["voie desc", "millesimeSortie desc"])
    .execute()
    .then(cleanNull);
