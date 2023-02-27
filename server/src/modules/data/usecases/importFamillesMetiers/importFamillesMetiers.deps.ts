import { db, pool } from "../../../../db/zapatos";
import { FamilleMetier } from "../../entities/FamillesMetiers";

export const createFamillesMetiers = async (famillesMetiers: FamilleMetier[]) =>
  db.upsert("familleMetier", famillesMetiers, "mefStat11Specialite").run(pool);

export const importFamillesMetiersDeps = { createFamillesMetiers };
