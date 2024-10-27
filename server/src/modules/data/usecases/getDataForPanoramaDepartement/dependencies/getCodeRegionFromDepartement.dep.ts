import { getKbdClient } from "@/db/db";

export const getCodeRegionFromDepartement = (codeDepartement: string | string[]) => {
  return getKbdClient()
    .selectFrom("departement")
    .where((w) => {
      if (Array.isArray(codeDepartement)) {
        return w("codeDepartement", "in", codeDepartement);
      }
      return w("codeDepartement", "=", codeDepartement);
    })
    .select(["codeRegion"])
    .executeTakeFirstOrThrow();
};
