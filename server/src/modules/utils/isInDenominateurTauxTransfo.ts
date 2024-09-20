import { ExpressionBuilder } from "kysely";

import { DB } from "../../db/db";

export const isInDenominateurTauxTransfo = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "campagne" | "constatRentree" | "dataFormation">;
}) =>
  eb
    .case()
    .when("campagne.annee", "=", "2023")
    .then(eb("constatRentree.anneeDispositif", "=", 1))
    .else(
      eb
        .case()
        .when("dataFormation.typeFamille", "in", ["specialite", "option"])
        .then(eb("constatRentree.anneeDispositif", "=", 2))
        .when("dataFormation.typeFamille", "in", [
          "2nde_commune",
          "1ere_commune",
        ])
        .then(false)
        .else(eb("constatRentree.anneeDispositif", "=", 1))
        .end()
    )
    .end();
