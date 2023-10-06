import { kdb } from "../../../../../../db/db";
import { cleanNull } from "../../../../../../utils/noNull";

export const findFamilleMetier = async ({
  cfdSpecialite,
}: {
  cfdSpecialite: string;
}) => {
  const result = await kdb
    .selectFrom("familleMetier")
    .selectAll("familleMetier")
    .where("cfdSpecialite", "=", cfdSpecialite)
    .executeTakeFirst();
  return result && cleanNull(result);
};
