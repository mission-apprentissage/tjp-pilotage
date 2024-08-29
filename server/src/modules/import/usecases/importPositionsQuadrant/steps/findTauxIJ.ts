// Based on : https://orion.inserjeunes.beta.gouv.fr/metabase/question/515-taux-ij-par-region-niveau-et-millesime?millesime=2021_2022&code_region=&diplome=&filiere=&voie=scolaire

import { ExpressionBuilder, sql } from "kysely";
import { VoieEnum } from "shared";

import { kdb } from "../../../../../db/db";
import { DB } from "../../../../../db/schema";

const selectSortants = (
  eb: ExpressionBuilder<DB, "indicateurRegionSortie" | "niveauDiplome">
) =>
  eb
    .case()
    .when(eb.ref("nbInsertion6mois"), ">=", 0)
    .then(eb.ref("nbSortants"))
    .else(0)
    .end();

const selectEffectifIJ = (
  eb: ExpressionBuilder<DB, "indicateurRegionSortie" | "niveauDiplome">
) =>
  eb
    .case()
    .when(eb.ref("nbPoursuiteEtudes"), ">=", 0)
    .then(eb.ref("effectifSortie"))
    .else(0)
    .end();

const selectDenominateurTauxDevenir = (
  eb: ExpressionBuilder<DB, "indicateurRegionSortie" | "niveauDiplome">
) =>
  eb
    .case()
    .when(
      eb.and([
        eb(eb.ref("nbInsertion6mois"), ">=", 0),
        eb(eb.ref("nbPoursuiteEtudes"), ">=", 0),
      ])
    )
    .then(eb.ref("indicateurRegionSortie.effectifSortie"))
    .else(0)
    .end();

export const findTauxIJ = async ({
  millesimeSortie,
  codeRegion,
  codeNiveauDiplome,
}: {
  millesimeSortie: string | undefined;
  codeRegion?: string | undefined;
  codeNiveauDiplome?: string | undefined;
}) =>
  await kdb
    .selectFrom("indicateurRegionSortie")
    .leftJoin("formationView", (join) =>
      join.on((eb) =>
        eb.and([
          eb(
            eb.ref("formationView.cfd"),
            "=",
            eb.ref("indicateurRegionSortie.cfd")
          ),
          eb(
            eb.ref("indicateurRegionSortie.voie"),
            "=",
            eb.ref("formationView.voie")
          ),
        ])
      )
    )
    .leftJoin(
      "niveauDiplome",
      "niveauDiplome.codeNiveauDiplome",
      "formationView.codeNiveauDiplome"
    )
    .select((sb) => [
      sb
        .case()
        .when(sb.fn.sum<number>(selectSortants(sb)), ">=", 20)
        .then(
          sql<number>`100 * ${sb.fn.sum<number>(
            "nbInsertion6mois"
          )}::FLOAT / ${sb.fn.sum<number>(selectSortants(sb))}::FLOAT`
        )
        .else(-1)
        .end()
        .as("tauxInsertion6mois"),
      sb
        .case()
        .when(sb.fn.sum<number>(selectEffectifIJ(sb)), ">=", 20)
        .then(
          sql<number>`100 * ${sb.fn.sum<number>(
            "nbPoursuiteEtudes"
          )}::FLOAT / ${sb.fn.sum<number>(selectEffectifIJ(sb))}::FLOAT`
        )
        .else(-1)
        .end()
        .as("tauxPoursuite"),
      sb
        .case()
        .when(
          sql<number>`${sb.fn.sum<number>(
            selectDenominateurTauxDevenir(sb)
          )}::FLOAT`,
          ">=",
          20
        )
        .then(
          sql<number>`100 * ${sb.fn.sum<number>(
            sql<number>`${sb.ref("nbPoursuiteEtudes")} + ${sb.ref(
              "nbInsertion6mois"
            )}::FLOAT`
          )} / ${sb.fn.sum<number>(selectDenominateurTauxDevenir(sb))}::FLOAT`
        )
        .else(-1)
        .end()
        .as("tauxDevenirFavorable"),
    ])
    .groupBy([
      "millesimeSortie",
      "indicateurRegionSortie.codeRegion",
      "formationView.codeNiveauDiplome",
      "formationView.voie",
    ])
    .where((eb) =>
      eb(eb.ref("formationView.voie"), "=", eb.val(VoieEnum.scolaire))
    )
    .$call((q) => {
      if (millesimeSortie) {
        return q.where(
          "indicateurRegionSortie.millesimeSortie",
          "=",
          millesimeSortie
        );
      }
      return q;
    })
    .$call((q) => {
      if (codeNiveauDiplome) {
        return q.where(
          "niveauDiplome.codeNiveauDiplome",
          "=",
          codeNiveauDiplome
        );
      }
      return q;
    })
    .$call((q) => {
      if (codeRegion) {
        return q.where("indicateurRegionSortie.codeRegion", "=", codeRegion);
      }
      return q;
    })
    .executeTakeFirst();
