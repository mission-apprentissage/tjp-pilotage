import { kdb } from "../../../../db/db";

export const findAcademie = (codeAcademie: string) =>
  kdb
    .selectFrom("academie")
    .selectAll()
    .where("codeAcademie", "=", codeAcademie)
    .limit(1)
    .executeTakeFirst();
