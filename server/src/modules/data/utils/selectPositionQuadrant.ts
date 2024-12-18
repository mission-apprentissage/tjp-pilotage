import type { ExpressionBuilder } from "kysely";
import { PositionQuadrantEnum } from "shared/enum/positionQuadrantEnum";
import { TypeFamilleEnum } from "shared/enum/typeFamille";

import type { DB } from "@/db/db";

export const selectPositionQuadrant = ({
  eb,
}: {
  eb: ExpressionBuilder<DB, "positionFormationRegionaleQuadrant" | "dataFormation">;
}) => {
  return eb
    .case()
    .when(eb.ref("positionFormationRegionaleQuadrant.positionQuadrant"), "is not", null)
    .then(eb.ref("positionFormationRegionaleQuadrant.positionQuadrant"))
    .else(
      eb
        .case()
        .when(eb.ref("dataFormation.typeFamille"), "in", [
          TypeFamilleEnum["1ere_commune"],
          TypeFamilleEnum["2nde_commune"],
        ])
        .then(eb.val(PositionQuadrantEnum["-"]))
        .else(eb.val(PositionQuadrantEnum["Hors quadrant"]))
        .end()
    )
    .end();
};
