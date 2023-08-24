import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";

export const findFormationQuery = async ({ cfd }: { cfd: string }) => {
  const formation = await kdb
    .selectFrom("formation")
    .where("codeFormationDiplome", "=", cfd)
    .selectAll("formation")
    .limit(1)
    .executeTakeFirst();
  return formation && cleanNull(formation);
};
