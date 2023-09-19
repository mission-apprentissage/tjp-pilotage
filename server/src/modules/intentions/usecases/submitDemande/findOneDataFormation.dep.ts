import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";

export const findOneDataFormation = async ({ cfd }: { cfd: string }) => {
  const formation = await kdb
    .selectFrom("dataFormation")
    .selectAll()
    .where("cfd", "=", cfd)
    .limit(1)
    .executeTakeFirst();
  return cleanNull(formation);
};
