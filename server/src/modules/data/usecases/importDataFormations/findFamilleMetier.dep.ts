import { kdb } from "../../../../db/db";

export const find2ndeCommune = async (cfd: string) => {
  return await kdb
    .selectFrom("familleMetier")
    .where("cfdFamille", "=", cfd)
    .selectAll()
    .limit(1)
    .executeTakeFirst();
};

export const findSpecialite = async (cfd: string) => {
  return await kdb
    .selectFrom("familleMetier")
    .where("cfdSpecialite", "=", cfd)
    .selectAll()
    .limit(1)
    .executeTakeFirst();
};
