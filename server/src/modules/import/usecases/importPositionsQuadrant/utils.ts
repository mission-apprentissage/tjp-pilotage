import type { ExpressionBuilder } from "kysely";

import type { DB } from "@/db/schema";

export const selectSortants = (eb: ExpressionBuilder<DB, "indicateurRegionSortie" | "niveauDiplome">) =>
  eb.case().when(eb.ref("nbInsertion6mois"), ">=", 0).then(eb.ref("nbSortants")).else(0).end();

export const selectEffectifIJ = (eb: ExpressionBuilder<DB, "indicateurRegionSortie" | "niveauDiplome">) =>
  eb.case().when(eb.ref("nbPoursuiteEtudes"), ">=", 0).then(eb.ref("effectifSortie")).else(0).end();

export const selectDenominateurTauxDevenir = (eb: ExpressionBuilder<DB, "indicateurRegionSortie" | "niveauDiplome">) =>
  eb
    .case()
    .when(eb.and([eb(eb.ref("nbInsertion6mois"), ">=", 0), eb(eb.ref("nbPoursuiteEtudes"), ">=", 0)]))
    .then(eb.ref("indicateurRegionSortie.effectifSortie"))
    .else(0)
    .end();
