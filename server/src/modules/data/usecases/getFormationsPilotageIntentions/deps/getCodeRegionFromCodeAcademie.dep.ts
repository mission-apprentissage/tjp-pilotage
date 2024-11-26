import { getKbdClient } from "@/db/db";

export const getCodeRegionFromAcademieQuery = (codeAcademie: string | string[]) => {
  return getKbdClient()
    .selectFrom("academie")
    .where((w) => {
      if (Array.isArray(codeAcademie)) {
        return w("codeAcademie", "in", codeAcademie);
      }
      return w("codeAcademie", "=", codeAcademie);
    })
    .select(["codeRegion"])
    .executeTakeFirstOrThrow();
};
