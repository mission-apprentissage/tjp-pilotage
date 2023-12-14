import { kdb } from "../../../db/db";
import { cleanNull } from "../../../utils/noNull";
import { isDemandeNotDeleted } from "../../utils/isDemandeSelectable";

export const findOneDemande = async (id: string) => {
  return cleanNull(
    await kdb
      .selectFrom("demande")
      .selectAll()
      .where("id", "=", id)
      .where(isDemandeNotDeleted)
      .executeTakeFirst()
  );
};
