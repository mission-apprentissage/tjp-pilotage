import { kdb } from "../../../../../../db/db";
import { cleanNull } from "../../../../../../utils/noNull";

export const findAnneeCommune = async ({
  cfdFamille,
}: {
  cfdFamille: string;
}) => {
  const result = await kdb
    .selectFrom("familleMetier")
    .selectAll()
    .where("cfdFamille", "=", cfdFamille)
    .executeTakeFirst();
  return result && cleanNull(result);
};

export const findSpecialite = async ({
  cfdSpecialite,
}: {
  cfdSpecialite: string;
}) => {
  const result = await kdb
    .selectFrom("familleMetier")
    .selectAll()
    .where("cfdSpecialite", "=", cfdSpecialite)
    .executeTakeFirst();
  return result && cleanNull(result);
};
