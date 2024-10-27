import { sql } from "kysely";

import { getKbdClient } from "@/db/db";
import type { DiplomeProfessionnelLine } from "@/modules/import/fileTypes/DiplomesProfessionnels";

export const findDiplomeProfessionnel = async ({ cfd }: { cfd: string }) => {
  const result = await getKbdClient()
    .selectFrom("rawData")
    .select("data")
    .where("type", "=", "diplomesProfessionnels")
    .where((eb) =>
      eb.or([
        eb(sql`"data"->>'Code diplôme'`, "like", `${cfd.slice(0, 3)}-${cfd.slice(3, 8)}%`),
        eb(sql`"data"->>'Code diplôme'`, "like", `${cfd}%`),
      ])
    )
    .limit(1)
    .executeTakeFirst();

  return result?.data as DiplomeProfessionnelLine;
};
