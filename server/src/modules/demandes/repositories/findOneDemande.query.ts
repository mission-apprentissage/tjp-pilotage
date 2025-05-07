import { getKbdClient } from "@/db/db";
import { cleanNull } from "@/utils/noNull";

export const findOneDemandeQuery = (numero: string) =>
  getKbdClient()
    .selectFrom("latestDemandeView as demande")
    .selectAll()
    .where("numero", "=", numero)
    .executeTakeFirst()
    .then(cleanNull);
