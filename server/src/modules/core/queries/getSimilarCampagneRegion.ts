import type { Insertable } from "kysely";

import type { DB } from "@/db/db";
import { getKbdClient } from "@/db/db";

export const getSimilarCampagneRegion = async ({ data }: { data: Insertable<DB["campagneRegion"]> }) =>
  await getKbdClient()
    .selectFrom("campagneRegion")
    .innerJoin("region", "region.codeRegion", "campagneRegion.codeRegion")
    .innerJoin("campagne", "campagne.id", "campagneRegion.campagneId")
    .selectAll("campagneRegion")
    .select(["campagne.annee as annee", "region.libelleRegion as region"])
    .where((eb) => eb.and([
      eb("campagneRegion.codeRegion", "=", data.codeRegion),
      eb("campagneRegion.campagneId", "=", data.campagneId)
    ]))
    .executeTakeFirst();
