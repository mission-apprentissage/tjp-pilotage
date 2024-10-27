import { getKbdClient } from "@/db/db";

export const find2ndeCommune = async (cfd: string) => {
  return await getKbdClient()
    .selectFrom("familleMetier")
    .where("cfdFamille", "=", cfd)
    .selectAll()
    .limit(1)
    .executeTakeFirst();
};

export const findSpecialite = async (cfd: string) => {
  return await getKbdClient()
    .selectFrom("familleMetier")
    .where("cfd", "=", cfd)
    .selectAll()
    .limit(1)
    .executeTakeFirst();
};

export const find1ereCommune = async (cfd: string) => {
  return await getKbdClient()
    .selectFrom("familleMetier")
    .where("cfdFamille", "=", cfd)
    .selectAll()
    .limit(1)
    .executeTakeFirst();
};

export const findOption = async (cfd: string) => {
  return await getKbdClient()
    .selectFrom("familleMetier")
    .where("cfd", "=", cfd)
    .selectAll()
    .limit(1)
    .executeTakeFirst();
};
