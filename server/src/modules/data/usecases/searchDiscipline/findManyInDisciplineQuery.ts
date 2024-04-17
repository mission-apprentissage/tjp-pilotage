import { sql } from "kysely";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";

export const findManyInDisciplineQuery = async ({
  search,
}: {
  search: string;
}) => {
  const search_array = search.split(" ");

  const disciplines = await kdb
    .selectFrom("discipline")
    .select([
      "discipline.libelleDiscipline as value",
      "discipline.libelleDiscipline as label",
    ])
    .distinct()
    .where((eb) =>
      eb.and([
        eb.or([
          eb("discipline.codeDiscipline", "ilike", `${search}%`),
          eb.and(
            search_array.map((search_word) =>
              eb(
                sql`unaccent(${eb.ref("discipline.libelleDiscipline")})`,
                "ilike",
                `%${search_word
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")}%`
              )
            )
          ),
        ]),
        eb.or([
          eb("discipline.dateFermeture", "is", null),
          eb("discipline.dateFermeture", ">", sql<Date>`now()`),
        ]),
        eb("discipline.dateOuverture", "<", sql<Date>`now()`),
      ])
    )
    .limit(60)
    .execute();

  return disciplines.map(cleanNull);
};
