import { sql } from "kysely";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";
import { getNormalizedSearchArray } from "../../../utils/normalizeSearch";

export const searchFiliereQuery = async ({ search }: { search: string }) => {
  const search_array = getNormalizedSearchArray(search);

  const filieres = await kdb
    .selectFrom("nsf")
    .select(["nsf.libelleNsf as label", "nsf.codeNsf as value"])
    .distinct()
    .where((eb) =>
      eb.and([
        eb.or([
          eb("nsf.codeNsf", "ilike", `${search}%`),
          eb.and(
            search_array.map((search_word) =>
              eb(
                sql`unaccent(${eb.ref("nsf.libelleNsf")})`,
                "ilike",
                `%${search_word}%`
              )
            )
          ),
        ]),
      ])
    )
    .limit(60)
    .execute();

  return filieres.map(cleanNull);
};
