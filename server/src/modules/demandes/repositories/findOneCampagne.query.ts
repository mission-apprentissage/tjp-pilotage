import { getKbdClient } from "@/db/db";
import { cleanNull } from "@/utils/noNull";

export const findOneCampagneQuery = ({ id }: { id: string }) =>
  getKbdClient()
    .selectFrom("campagne")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst()
    .then(cleanNull);
