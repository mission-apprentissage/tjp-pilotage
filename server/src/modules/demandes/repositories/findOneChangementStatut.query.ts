import { getKbdClient } from "@/db/db";
import { cleanNull } from "@/utils/noNull";

export const findOneChangementStatut = async (id: string) =>
  getKbdClient()
    .selectFrom("changementStatut")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst()
    .then(cleanNull);
