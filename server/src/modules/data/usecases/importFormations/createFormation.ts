import { IsolationLevel } from "zapatos/db";

import { db, pool } from "../../../../db/zapatos";
import { Formation } from "../../entities/Formation";

export const createFormation = async (formations: Omit<Formation, "id">[]) => {
  await db.transaction(pool, IsolationLevel.Serializable, (tr) =>
    db.upsert("formation", formations, "codeFormationDiplome").run(tr)
  );
};
