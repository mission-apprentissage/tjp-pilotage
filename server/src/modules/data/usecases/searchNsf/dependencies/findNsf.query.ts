import { sql } from "kysely";
import { CURRENT_RENTREE } from "shared";

import { getKbdClient } from "@/db/db";
import { openForRentreeScolaire } from "@/modules/data/utils/openForRentreeScolaire";
import { getNormalizedSearch } from "@/modules/utils/normalizeSearch";
import { cleanNull } from "@/utils/noNull";

export const findNsfQuery = async ({ search, limit = 100 }: { search: string; limit?: number }) => {
  const normalizedSearch = getNormalizedSearch(search);

  const disciplines = await getKbdClient()
    .selectFrom("nsf")
    .select(["nsf.codeNsf as value", "nsf.libelleNsf as label"])
    .where((eb) => sql`unaccent(${eb.ref("nsf.libelleNsf")})`, "ilike", `%${normalizedSearch}%`)
    .leftJoin("formationView", "formationView.codeNsf", "nsf.codeNsf")
    .where((eb) => openForRentreeScolaire(eb, CURRENT_RENTREE))
    .orderBy("libelleNsf asc")
    .distinct()
    .limit(limit)
    .execute();

  return disciplines.map(cleanNull);
};
