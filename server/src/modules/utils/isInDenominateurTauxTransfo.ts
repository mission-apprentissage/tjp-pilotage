import type { ExpressionBuilder } from "kysely";
import { FIRST_ANNEE_CAMPAGNE } from "shared";

import type { DB } from "@/db/db";

export const isInDenominateurTauxTransfo = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "campagne" | "constatRentree" | "dataFormation">;
}) =>
  eb
    .case()
    .when("campagne.annee", "=", FIRST_ANNEE_CAMPAGNE)
    .then(eb("constatRentree.anneeDispositif", "=", 1))
    .else(
      eb
        .case()
        .when("dataFormation.typeFamille", "in", ["specialite", "option"])
        .then(eb("constatRentree.anneeDispositif", "=", 2))
        .when("dataFormation.typeFamille", "in", ["2nde_commune", "1ere_commune"])
        .then(false)
        .else(eb("constatRentree.anneeDispositif", "=", 1))
        .end()
    )
    .end();
