import { db, pool } from "../../../../db/zapatos";
import { Formation } from "../../entities/Formation";

const createFormation = async (formations: Omit<Formation, "id">[]) => {
  await db.upsert("formation", formations, "codeFormationDiplome").run(pool);
};

export const importFormationsDeps = { createFormation };
