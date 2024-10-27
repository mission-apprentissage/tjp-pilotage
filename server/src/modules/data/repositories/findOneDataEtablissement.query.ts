import { getKbdClient } from "@/db/db";
import { cleanNull } from "@/utils/noNull";

export const findOneDataEtablissement = async ({ uai }: { uai: string }) => {
  const etablissement = await getKbdClient()
    .selectFrom("dataEtablissement")
    .selectAll()
    .where("uai", "=", uai)
    .limit(1)
    .executeTakeFirst();
  return cleanNull(etablissement);
};
