import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";

export const findOneDataEtablissement = async ({ uai }: { uai: string }) => {
  const etablissement = await kdb
    .selectFrom("dataEtablissement")
    .selectAll()
    .where("uai", "=", uai)
    .limit(1)
    .executeTakeFirst();
  return cleanNull(etablissement);
};
