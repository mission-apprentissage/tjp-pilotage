import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";

export const findOneDemande = async (id: string) => {
  return cleanNull(
    await kdb
      .selectFrom("demande")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst()
  );
};
