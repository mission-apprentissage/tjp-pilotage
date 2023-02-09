import { db, pool } from "../../../../db/zapatos";
export const createFamilleMetier = async (line: {
  libelleOfficielFamille: string;
  libelleOfficielSpecialite: string;
  mefStat11Famille: string;
  mefStat11Specialite: string;
  codeMinistereTutelle: string;
}) => {
  await db.insert("famillesMetiers", line).run(pool);
};
