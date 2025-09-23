import { getKbdClient } from "@/db/db";
import { cleanNull } from "@/utils/noNull";

export const findOneDataFormationQuery = (cfd: string) =>
  getKbdClient()
    .selectFrom("dataFormation")
    .selectAll()
    .where("cfd", "=", cfd)
    .limit(1)
    .executeTakeFirst()
    .then(cleanNull);
