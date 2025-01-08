import { getKbdClient } from "@/db/db";
import { cleanNull } from "@/utils/noNull";

export const findOneDemande = async (numero: string) => {
  return cleanNull(
    await getKbdClient()
      .selectFrom("latestDemandeView as demande")
      .selectAll()
      .where("numero", "=", numero)
      .executeTakeFirst(),
  );
};
