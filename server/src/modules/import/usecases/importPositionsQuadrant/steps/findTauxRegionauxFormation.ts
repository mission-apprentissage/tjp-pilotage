// @ts-nocheck -- TODO

// Based on : https://orion.inserjeunes.beta.gouv.fr/metabase/question/515-taux-ij-par-region-niveau-et-millesime?millesime=2021_2022&code_region=&diplome=&filiere=&voie=scolaire

import { sql } from "kysely";
import { VoieEnum } from "shared";

import { getKbdClient } from "@/db/db";
import {
  selectDenominateurTauxDevenir,
  selectEffectifIJ,
  selectSortants,
} from "@/modules/import/usecases/importPositionsQuadrant/utils";

export const findTauxRegionauxFormation = async ({
  millesimeSortie,
  codeRegion,
  cfd,
}: {
  millesimeSortie?: string | undefined;
  codeRegion?: string | undefined;
  cfd?: string | undefined;
}) =>
  await getKbdClient()
    .selectFrom("indicateurRegionSortie")
    .leftJoin("formationView", (join) =>
      join.on((eb) =>
        eb.and([
          eb(eb.ref("formationView.cfd"), "=", eb.ref("indicateurRegionSortie.cfd")),
          eb(eb.ref("indicateurRegionSortie.voie"), "=", eb.ref("formationView.voie")),
        ])
      )
    )
    .leftJoin("niveauDiplome", "niveauDiplome.codeNiveauDiplome", "formationView.codeNiveauDiplome")
    .select((sb) => [
      sb
        .case()
        .when(sb.fn.sum<number>(selectSortants(sb)), ">=", 20)
        .then(
          sql<number>`100 * ${sb.fn.sum<number>(
            "nbInsertion6mois"
          )}::FLOAT / ${sb.fn.sum<number>(selectSortants(sb))}::FLOAT`
        )
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
        .end()
        .as("tauxPoursuite"),
      sb
        .case()
        .when(sql<number>`${sb.fn.sum<number>(selectDenominateurTauxDevenir(sb))}::FLOAT`, ">=", 20)
        .then(
          sql<number>`100 * ${sb.fn.sum<number>(
            sql<number>`${sb.ref("nbPoursuiteEtudes")} + ${sb.ref("nbInsertion6mois")}::FLOAT`
          )} / ${sb.fn.sum<number>(selectDenominateurTauxDevenir(sb))}::FLOAT`
        )
        .end()
        .as("tauxDevenirFavorable"),
      "formationView.cfd",
      "indicateurRegionSortie.codeDispositif",
    ])
    .groupBy([
      "millesimeSortie",
      "indicateurRegionSortie.codeRegion",
      "formationView.cfd",
      "formationView.voie",
      "indicateurRegionSortie.codeDispositif",
    ])
    .where((eb) => eb(eb.ref("formationView.voie"), "=", eb.val(VoieEnum.scolaire)))
    .$call((q) => {
      if (millesimeSortie) {
        return q.where("indicateurRegionSortie.millesimeSortie", "=", millesimeSortie);
      }
      return q;
    })
    .$call((q) => {
      if (cfd) {
        return q.where("formationView.cfd", "=", cfd);
      }
      return q;
    })
    .$call((q) => {
      if (codeRegion) {
        return q.where("indicateurRegionSortie.codeRegion", "=", codeRegion);
      }
      return q;
    })
    .execute();
