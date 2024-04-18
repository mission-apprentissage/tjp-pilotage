import { kdb } from "../../../db/db";
import { cleanNull } from "../../../utils/noNull";

export const findOneDemandeExpe = async (numero: string) => {
  return cleanNull(
    await kdb
      .selectFrom("latestDemandeExpeView as demandeExpe")
      .selectAll()
      .where("numero", "=", numero)
      .executeTakeFirst()
  );
};
