import type { Insertable } from "kysely";
import { omit } from "lodash-es";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";

export const createFormationHistorique = async (
  ancienneFormation: Insertable<DB["formation"]> & {
    nouveauCFD: string;
    voie: string;
  },
) => {
  const formationHistorique = {
    cfd: ancienneFormation.nouveauCFD,
    ancienCFD: ancienneFormation.codeFormationDiplome,
    voie: ancienneFormation.voie,
  };
  getKbdClient()
    .transaction()
    .execute(async (t) => {
      await t
        .insertInto("formation")
        .values(omit(ancienneFormation, ["nouveauCFD", "voie"]))
        .onConflict((oc) =>
          oc.column("codeFormationDiplome").doUpdateSet(omit(ancienneFormation, ["nouveauCFD", "voie"])),
        )
        .execute();

      await t
        .insertInto("formationHistorique")
        .values(formationHistorique)
        .onConflict((oc) => oc.columns(["ancienCFD", "cfd", "voie"]).doUpdateSet(formationHistorique))
        .execute();
    });
};
