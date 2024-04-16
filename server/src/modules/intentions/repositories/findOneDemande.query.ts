import { kdb } from "../../../db/db";
import { cleanNull } from "../../../utils/noNull";

export const findOneDemande = async (numero: string) => {
  return cleanNull(
    await kdb
      .selectFrom("latestDemandeView as demande")
      .selectAll()
      .where("numero", "=", numero)
      .executeTakeFirst()
  );
};
