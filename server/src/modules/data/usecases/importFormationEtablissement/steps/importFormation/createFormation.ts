import { kdb } from "../../../../../../db/db";
import { Formation } from "../../../../entities/Formation";

export const createFormation = async (formation: Omit<Formation, "id">) => {
  await kdb
    .insertInto("formation")
    .values(formation)
    .onConflict((oc) =>
      oc.column("codeFormationDiplome").doUpdateSet(formation)
    )
    .execute();
};
