import { Insertable } from "kysely";
import _ from "lodash";

import { kdb } from "../../../../../../db/db";
import { DB } from "../../../../../../db/schema";

export const createFormationHistorique = async (
  ancienneFormation: Insertable<DB["formation"]> & {
    nouveauCFD: string;
  }
) => {
  const formationHistorique = {
    codeFormationDiplome: ancienneFormation.nouveauCFD,
    ancienCFD: ancienneFormation.codeFormationDiplome,
  };
  kdb.transaction().execute(async (t) => {
    await t
      .insertInto("formation")
      .values(_.omit(ancienneFormation, "nouveauCFD"))
      .onConflict((oc) => oc.column("codeFormationDiplome").doNothing())
      .execute();

    await t
      .insertInto("formationHistorique")
      .values(formationHistorique)
      .onConflict((oc) =>
        oc.columns(["ancienCFD", "codeFormationDiplome"]).doNothing()
      )
      .execute();
  });
};
