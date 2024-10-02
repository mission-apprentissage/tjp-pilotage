import { kdb } from "../../../../../db/db";

export const getCodeRegionFromAcademieQuery = (
  codeAcademie: string | string[]
) => {
  return kdb
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
