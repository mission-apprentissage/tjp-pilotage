import { expressionBuilder, sql } from "kysely";
import { CURRENT_RENTREE } from "shared";
import { MILLESIMES_IJ_ETAB } from "shared/time/millesimes";

import { DB, kdb } from "../../../../../db/db";
import { cleanNull } from "../../../../../utils/noNull";

export const getInformations = ({ uai }: { uai: string }) =>
  kdb
    .selectFrom("etablissement")
    .leftJoin(
      "departement",
      "etablissement.codeDepartement",
      "departement.codeDepartement"
    )
    .leftJoin("formationEtablissement as feScolaire", (join) =>
      join
        .onRef("UAI", "=", "etablissement.UAI")
        .on("voie", "=", sql<string>`'scolaire'`)
    )
    .leftJoin("formationEtablissement as feApprentissage", (join) =>
      join
        .onRef("UAI", "=", "etablissement.UAI")
        .on("voie", "=", sql<string>`'voie'`)
    )
    .where("etablissement.UAI", "=", uai)
    .select((eb) => [
      sql<string>`trim(split_part(split_part(split_part(split_part(${eb.ref(
        "etablissement.libelleEtablissement"
      )},' - Lycée',1),' -Lycée',1),',',1),' : ',1))`.as(
        "libelleEtablissement"
      ),
      eb.ref("etablissement.adresseEtablissement").as("adresse"),
      eb.ref("etablissement.commune").as("commune"),
      eb.ref("etablissement.codePostal").as("codePostal"),
      eb.ref("departement.libelleDepartement").as("libelleDepartement"),
      eb.ref("departement.codeDepartement").as("codeDepartement"),
      sql<boolean>`count(${eb.table(
        "feScolaire"
      )}.*) over (partition by ${eb.ref("feScolaire.UAI")}) > 0`.as(
        "isScolaire"
      ),
      sql<boolean>`count(${eb.table(
        "feApprentissage"
      )}.*) over (partition by ${eb.ref("feApprentissage.UAI")}) > 0`.as(
        "isApprentissage"
      ),
      eb.ref("etablissement.secteur").as("secteur"),
    ])
    .executeTakeFirst()
    .then(cleanNull);

export const getValeurAjoutee = ({
  uai,
  millesime = MILLESIMES_IJ_ETAB,
}: {
  uai: string;
  millesime?: string[];
}) =>
  kdb
    .selectFrom("indicateurEtablissement")
    .where("UAI", "=", uai)
    .where("millesime", "in", millesime)
    .select((eb) => [
      eb.ref("UAI").as("uai"),
      eb.ref("millesime").as("millesime"),
      eb.ref("valeurAjoutee").as("valeurAjoutee"),
    ])
    .orderBy("millesime", "desc")
    .execute();

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
      eb.fn
        .sum<number>((s) =>
          s
            .case()
            .when(
              eb.and([
                eb("effectifSortie", ">=", sql<number>`1`),
                eb("nbPoursuiteEtudes", ">=", sql<number>`0`),
              ])
            )
            .then("nbPoursuiteEtudes")
            .end()
        )
        .as("numerateurPoursuite"),
      eb.fn
        .sum<number>((s) =>
          s
            .case()
            .when(
              eb.and([
                eb("effectifSortie", ">=", sql<number>`1`),
                eb("nbPoursuiteEtudes", ">=", sql<number>`0`),
              ])
            )
            .then("effectifSortie")
            .end()
        )
        .as("denominateurPoursuite"),
      eb.fn
        .sum<number>((s) =>
          s
            .case()
            .when(
              eb.and([
                eb("nbSortants", ">=", sql<number>`1`),
                eb("nbInsertion6mois", ">=", sql<number>`0`),
              ])
            )
            .then("nbInsertion6mois")
            .end()
        )
        .as("numerateurEmploi"),
      eb.fn
        .sum<number>((s) =>
          s
            .case()
            .when(
              eb.and([
                eb("nbSortants", ">=", sql<number>`1`),
                eb("nbInsertion6mois", ">=", sql<number>`0`),
              ])
            )
            .then("nbSortants")
            .end()
        )
        .as("denominateurEmploi"),
      eb.fn
        .sum<number>((s) =>
          s
            .case()
            .when(
              eb.and([
                eb("effectifSortie", ">=", sql<number>`1`),
                eb("nbPoursuiteEtudes", ">=", sql<number>`0`),
                eb("nbInsertion6mois", ">=", sql<number>`0`),
              ])
            )
            .then(
              sql`${eb.ref("nbPoursuiteEtudes")} + ${eb.ref(
                "nbInsertion6mois"
              )}`
            )
            .end()
        )
        .as("numerateurDevenir"),
      eb.fn
        .sum<number>((s) =>
          s
            .case()
            .when(
              eb.and([
                eb("effectifSortie", ">=", sql<number>`1`),
                eb("nbPoursuiteEtudes", ">=", sql<number>`0`),
                eb("nbInsertion6mois", ">=", sql<number>`0`),
              ])
            )
            .then("effectifSortie")
            .end()
        )
        .as("denominateurDevenir"),
      eb.fn
        .count((c) =>
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
        )
        .as("nbOffresTauxPoursuite"),
      eb.fn
        .count((c) =>
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
        )
        .as("nbOffresTauxEmploi6mois"),
      eb.fn
        .count((c) =>
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
        )
        .as("nbOffresTauxDevenir"),
      eb.fn
        .count(
          sql`${eb.ref("UAI")} || ${eb.ref("cfd")} || coalesce(${eb.ref(
            "dispositifId"
          )},'')`
        )
        .as("nbOffresScolaire"),
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
    .execute();

export const getFilieres = ({ uai }: { uai: string }) => {
  console.log("getFilieres", uai);
  return Promise.resolve([
    { icon: "solar:masks-linear", name: "Arts plastiques" },
    {
      icon: "solar:black-hole-2-linear",
      name: "Agro-alimentaire, alimentation",
    },
  ]);
};
