import { getKbdClient } from "@/db/db";
import { cleanNull } from "@/utils/noNull";

export const findOneIntention = async (numero: string) => {
  return cleanNull(
    await getKbdClient()
      .selectFrom("latestDemandeIntentionView as intention")
      .selectAll()
      .where("numero", "=", numero)
      .executeTakeFirst(),
  );
};
