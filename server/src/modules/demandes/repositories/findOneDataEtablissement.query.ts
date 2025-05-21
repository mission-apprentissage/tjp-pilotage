import { getKbdClient } from "@/db/db";
import { cleanNull } from "@/utils/noNull";

export const findOneDataEtablissementQuery = async ({ uai }: { uai: string }) =>
  await getKbdClient()
    .selectFrom("dataEtablissement")
    .selectAll()
    .where("uai", "=", uai)
    .limit(1)
    .executeTakeFirst().
    then(cleanNull);
