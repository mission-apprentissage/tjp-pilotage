import { IsolationLevel } from "zapatos/db";

import { db, pool } from "../../../../db/zapatos";
import { FamilleMetier } from "../../entities/FamillesMetiers";

export const createFamillesMetiers = async (famillesMetiers: FamilleMetier[]) =>
  await db.transaction(pool, IsolationLevel.Serializable, (tr) =>
    db.upsert("familleMetier", famillesMetiers, "mefStat11Specialite").run(tr)
  );
