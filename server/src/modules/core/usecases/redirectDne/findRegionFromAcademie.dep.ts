import { getKbdClient } from "@/db/db";

export const findRegionFromAcademie = async (codeAcademie: string) =>
  await getKbdClient()
    .selectFrom("academie")
    .select("codeRegion")
    .where("codeAcademie", "=", codeAcademie)
    .executeTakeFirst();
