import { kdb } from "../../../../../../db/db";
import { cleanNull } from "../../../../../../utils/noNull";

export const findHistorique = async ({ cfd }: { cfd: string }) => {
  const result = await kdb
    .selectFrom("formationHistorique")
    .selectAll()
    .where("ancienCFD", "=", cfd)
    .executeTakeFirst();
  return result && cleanNull(result);
};
