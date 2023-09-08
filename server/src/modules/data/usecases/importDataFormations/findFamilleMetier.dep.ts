import { kdb } from "../../../../db/db";

export const findFamilleMetier = async (cfd: string) => {
  return await kdb
    .selectFrom("familleMetier")
    .where((eb) => eb("cfdFamille", "=", cfd).or("cfdSpecialite", "=", cfd))
    .selectAll()
    .limit(1)
    .executeTakeFirst();
};
