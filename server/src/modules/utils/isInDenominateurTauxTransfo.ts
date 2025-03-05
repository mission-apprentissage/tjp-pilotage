import type { ExpressionBuilder } from "kysely";
import { FIRST_ANNEE_CAMPAGNE } from "shared";
import { TypeFamilleEnum } from "shared/enum/typeFamilleEnum";

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
        .when("dataFormation.typeFamille", "in", [TypeFamilleEnum["specialite"], TypeFamilleEnum["option"]])
        .then(eb("constatRentree.anneeDispositif", "=", 2))
        .when("dataFormation.typeFamille", "in", [TypeFamilleEnum["2nde_commune"], TypeFamilleEnum["1ere_commune"]])
        .then(false)
        .else(eb("constatRentree.anneeDispositif", "=", 1))
        .end()
    )
    .end();
