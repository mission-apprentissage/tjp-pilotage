import { sql } from "kysely";
import { CURRENT_RENTREE } from "shared";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";
import { openForRentreeScolaire } from "../../utils/openForRentreeScolaire";

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
    .leftJoin("formationView", "formationView.codeNsf", "nsf.codeNsf")
    .where((eb) => openForRentreeScolaire(eb, CURRENT_RENTREE))
    .orderBy("libelleNsf asc")
    .distinct()
    .limit(20)
    .execute();

  return disciplines.map(cleanNull);
};
