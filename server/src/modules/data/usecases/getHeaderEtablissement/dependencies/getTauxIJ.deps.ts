import { sql } from "kysely";
import { CURRENT_RENTREE } from "shared";
import { MILLESIMES_IJ_ETAB } from "shared/time/millesimes";

import { getKbdClient } from "@/db/db";
import { selectTauxDevenirFavorable } from "@/modules/data/utils/tauxDevenirFavorable";
import { selectTauxInsertion6mois } from "@/modules/data/utils/tauxInsertion6mois";
import { selectTauxPoursuite } from "@/modules/data/utils/tauxPoursuite";
import { cleanNull } from "@/utils/noNull";

const getBase = ({ uai, rentreeScolaire }: { uai: string; rentreeScolaire: string }) =>
  getKbdClient()
    .selectFrom("formationEtablissement")
    .innerJoin("dataEtablissement", "dataEtablissement.uai", "formationEtablissement.uai")
    .innerJoin("dataFormation", "dataFormation.cfd", "formationEtablissement.cfd")
    .innerJoin("niveauDiplome as nd", "nd.codeNiveauDiplome", "dataFormation.codeNiveauDiplome")
    .leftJoin("dispositif", (join) =>
      join
        .onRef("dispositif.codeDispositif", "=", "formationEtablissement.codeDispositif")
        .on("formationEtablissement.voie", "=", "scolaire"),
    )
    .leftJoin("indicateurEntree", (join) =>
      join
        .onRef("indicateurEntree.formationEtablissementId", "=", "formationEtablissement.id")
        .on("formationEtablissement.voie", "=", "scolaire"),
    )
    .where((w) =>
      w.and([
        w.or([
          w("indicateurEntree.rentreeScolaire", "=", rentreeScolaire),
          w("indicateurEntree.rentreeScolaire", "is", null),
        ]),
        w("formationEtablissement.uai", "=", uai),
      ]),
    );

export const getChiffresIj = ({
  uai,
  rentreeScolaire,
  millesime = MILLESIMES_IJ_ETAB,
}: {
  uai: string;
  rentreeScolaire: string;
  millesime: string[];
}) =>
  getBase({ uai, rentreeScolaire })
    .innerJoin("indicateurSortie", "indicateurSortie.formationEtablissementId", "formationEtablissement.id")
    .where("millesimeSortie", "in", millesime)
    .select([
      "formationEtablissement.uai",
      "voie",
      "millesimeSortie",
      selectTauxPoursuite("indicateurSortie").as("tauxPoursuite"),
      selectTauxInsertion6mois("indicateurSortie").as("tauxInsertion"),
      selectTauxDevenirFavorable("indicateurSortie").as("tauxDevenirFavorable"),
      "nbSortants",
      "nbPoursuiteEtudes",
      "nbInsertion6mois",
      "effectifSortie",
    ])
    .groupBy([
      "formationEtablissement.uai",
      "voie",
      "millesimeSortie",
      "indicateurSortie.nbPoursuiteEtudes",
      "indicateurSortie.effectifSortie",
      "indicateurSortie.nbInsertion6mois",
      "indicateurSortie.nbSortants",
    ]);

export const getChiffresNumerateurAndDenominateur = ({
  uai,
  millesime = MILLESIMES_IJ_ETAB,
  rentreeScolaire,
}: {
  uai: string;
  rentreeScolaire: string;
  millesime: string[];
}) =>
  getKbdClient()
    .selectFrom(getChiffresIj({ uai, millesime, rentreeScolaire }).as("chiffresIj"))
    .select((eb) => [
      "uai",
      "voie",
      "millesimeSortie",
      eb.fn
        .sum<number>((s) =>
          s
            .case()
            .when(eb.and([eb("nbInsertion6mois", ">=", eb.val(0)), eb("nbSortants", ">=", eb.val(0))]))
            .then(sql<number>`${eb.ref("nbInsertion6mois")}::float`)
            .end(),
        )
        .as("numerateurEmploi"),
      eb.fn
        .sum<number>((s) =>
          s
            .case()
            .when(eb.and([eb("nbInsertion6mois", ">=", eb.val(0)), eb("nbSortants", ">=", eb.val(0))]))
            .then(sql<number>`${eb.ref("nbSortants")}::float`)
            .end(),
        )
        .as("denominateurEmploi"),
      eb.fn
        .sum<number>((s) =>
          s
            .case()
            .when(eb.and([eb("nbPoursuiteEtudes", ">=", eb.val(0)), eb("effectifSortie", ">=", eb.val(0))]))
            .then(sql<number>`${eb.ref("nbPoursuiteEtudes")}::float`)
            .end(),
        )
        .as("numerateurPoursuite"),
      eb.fn
        .sum<number>((s) =>
          s
            .case()
            .when(eb.and([eb("nbPoursuiteEtudes", ">=", eb.val(0)), eb("effectifSortie", ">=", eb.val(0))]))
            .then(sql<number>`${eb.ref("effectifSortie")}::float`)
            .end(),
        )
        .as("denominateurPoursuite"),
      eb.fn
        .sum<number>((s) =>
          s
            .case()
            .when(
              eb.and([
                eb("nbInsertion6mois", ">=", eb.val(0)),
                eb("nbPoursuiteEtudes", ">=", eb.val(0)),
                eb("effectifSortie", ">=", eb.val(0)),
              ]),
            )
            .then(sql<number>`(${eb.ref("nbPoursuiteEtudes")} + ${eb.ref("nbInsertion6mois")})::float`)
            .end(),
        )
        .as("numerateurDevenir"),
      eb.fn
        .sum<number>((s) =>
          s
            .case()
            .when(
              eb.and([
                eb("nbInsertion6mois", ">=", eb.val(0)),
                eb("nbPoursuiteEtudes", ">=", eb.val(0)),
                eb("effectifSortie", ">=", eb.val(0)),
              ]),
            )
            .then(sql<number>`${eb.ref("effectifSortie")}::float`)
            .end(),
        )
        .as("denominateurDevenir"),
    ])
    .groupBy(["uai", "voie", "millesimeSortie"]);

export const getTauxIJ = async ({
  uai,
  millesime = MILLESIMES_IJ_ETAB,
  rentreeScolaire = CURRENT_RENTREE,
}: {
  uai: string;
  codeNiveauDiplome?: string[];
  millesime?: string[];
  rentreeScolaire?: string;
}) =>
  getKbdClient()
    .selectFrom(
      getChiffresNumerateurAndDenominateur({
        uai,
        millesime,
        rentreeScolaire,
      }).as("chiffres"),
    )
    .select((eb) => [
      eb.ref("uai").as("uai"),
      "voie",
      "millesimeSortie",
      eb
        .case()
        .when(eb.ref("denominateurEmploi"), ">=", eb.val(20))
        .then(sql<number>`100 * ${eb.ref("numerateurEmploi")}::float/${eb.ref("denominateurEmploi")}::float`)
        .else(null)
        .end()
        .as("tauxEmploi6mois"),
      eb
        .case()
        .when(eb.ref("denominateurPoursuite"), ">=", eb.val(20))
        .then(sql<number>`100 * ${eb.ref("numerateurPoursuite")}::float/${eb.ref("denominateurPoursuite")}::float`)
        .else(null)
        .end()
        .as("tauxPoursuite"),
      eb
        .case()
        .when(eb.ref("denominateurDevenir"), ">=", eb.val(20))
        .then(sql<number>`100 * (${eb.ref("numerateurDevenir")}::float/${eb.ref("denominateurDevenir")}::float)`)
        .else(null)
        .end()
        .as("tauxDevenir"),
    ])
    .orderBy(["uai", "voie", "millesimeSortie desc"])
    .execute()
    .then(cleanNull);
