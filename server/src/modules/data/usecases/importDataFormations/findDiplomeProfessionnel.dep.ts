import { sql } from "kysely";

import { kdb } from "../../../../db/db";
import { DiplomeProfessionnelLine } from "../../fileTypes/DiplomesProfessionnels";

export const findDiplomeProfessionnel = async ({ cfd }: { cfd: string }) => {
  const result = await kdb
    .selectFrom("rawData")
    .select("data")
    .where("type", "=", "diplomesProfessionnels")
    .where(
      sql`"data"->>'Code diplôme'`,
      "like",
      `${cfd.slice(0, 3)}-${cfd.slice(3, 8)}%`
    )
    .limit(1)
    .executeTakeFirst();

  return result?.data as DiplomeProfessionnelLine;
};
