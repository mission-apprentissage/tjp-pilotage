import { getKbdClient } from "@/db/db";
import { cleanNull } from "@/utils/noNull";

export const findAnneeCommune = async ({ cfdFamille }: { cfdFamille: string }) => {
  const result = await getKbdClient()
    .selectFrom("familleMetier")
    .selectAll()
    .where("cfdFamille", "=", cfdFamille)
    .executeTakeFirst();
  return result && cleanNull(result);
};

export const findSpecialite = async ({ cfd }: { cfd: string }) => {
  const result = await getKbdClient().selectFrom("familleMetier").selectAll().where("cfd", "=", cfd).executeTakeFirst();
  return result && cleanNull(result);
};
