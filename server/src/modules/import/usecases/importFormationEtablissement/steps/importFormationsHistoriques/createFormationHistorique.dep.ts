import { Insertable } from "kysely";
import _ from "lodash";

import { DB, kdb } from "../../../../../../db/db";

export const createFormationHistorique = async (
  ancienneFormation: Insertable<DB["formation"]> & {
    nouveauCFD: string;
    voie: string;
  }
) => {
  const formationHistorique = {
    cfd: ancienneFormation.nouveauCFD,
    ancienCFD: ancienneFormation.codeFormationDiplome,
    voie: ancienneFormation.voie,
  };
  kdb.transaction().execute(async (t) => {
    await t
      .insertInto("formation")
      .values(_.omit(ancienneFormation, ["nouveauCFD", "voie"]))
      .onConflict((oc) =>
        oc
          .column("codeFormationDiplome")
          .doUpdateSet(_.omit(ancienneFormation, ["nouveauCFD", "voie"]))
      )
      .execute();

    await t
      .insertInto("formationHistorique")
      .values(formationHistorique)
      .onConflict((oc) =>
        oc
          .columns(["ancienCFD", "cfd", "voie"])
          .doUpdateSet(formationHistorique)
      )
      .execute();
  });
};
