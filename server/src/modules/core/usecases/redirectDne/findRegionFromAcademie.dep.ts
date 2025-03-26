import { getKbdClient } from "@/db/db";
import { cleanNull } from "@/utils/noNull";

export const findRegionFromAcademie = async (codeAcademie: string) =>
  await getKbdClient().selectFrom("academie").select("codeRegion").where("codeAcademie", "=", codeAcademie).executeTakeFirst().then(cleanNull);
