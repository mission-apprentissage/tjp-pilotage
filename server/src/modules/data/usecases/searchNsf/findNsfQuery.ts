import { sql } from "kysely";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";

export const findNsfQuery = async ({ search }: { search: string }) => {
  const normalizedSearch =
    search?.normalize("NFD").replace(/[\u0300-\u036f]/g, "") ?? "";

  const disciplines = await kdb
    .selectFrom("nsf")
    .select(["nsf.codeNsf as value", "nsf.libelleNsf as label"])
    .where(
      (eb) => sql`unaccent(${eb.ref("nsf.libelleNsf")})`,
      "ilike",
      `%${normalizedSearch}%`
    )
    .orderBy("libelleNsf asc")
    .limit(20)
    .execute();

  return disciplines.map(cleanNull);
};
