import { sql } from "kysely";

import { getKbdClient } from "@/db/db";
import { getNormalizedSearchArray } from "@/modules/utils/searchHelpers";
import { cleanNull } from "@/utils/noNull";

export const searchDisciplineQuery = async ({ search }: { search: string }) => {
  const search_array = getNormalizedSearchArray(search);

  const disciplines = await getKbdClient()
    .selectFrom("discipline")
    .select(["discipline.libelleDiscipline as value", "discipline.libelleDiscipline as label"])
    .distinct()
    .where((eb) =>
      eb.and([
        eb.or([
          eb("discipline.codeDiscipline", "ilike", `${search}%`),
          eb.and(
            search_array.map((search_word) =>
              eb(sql`unaccent(${eb.ref("discipline.libelleDiscipline")})`, "ilike", `%${search_word}%`)
            )
          ),
        ]),
      ])
    )
    .limit(60)
    .execute();

  return disciplines.map(cleanNull);
};
