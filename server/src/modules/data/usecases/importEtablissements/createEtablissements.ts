import { IsolationLevel } from "zapatos/db";

import { db, pool } from "../../../../db/zapatos";
import { Etablissement } from "../../entities/Etablissement";

export const createEtablissements = async (
  etablissements: Omit<Etablissement, "id">[]
) => {
  await db.transaction(pool, IsolationLevel.Serializable, async (tr) => {
    await db.upsert("etablissement", etablissements, ["UAI"]).run(tr);
  });
};
