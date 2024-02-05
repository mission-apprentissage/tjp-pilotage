import { sql } from "kysely";

import { kdb } from "../../../../db/db";
import { Offres_apprentissages } from "../../fileTypes/Offres_apprentissages";

export const findOffresApprentissages = async ({
  offset,
  limit,
}: {
  offset: number;
  limit: number;
}) => {
  const items = await kdb
    .selectFrom("rawData")
    .selectAll("rawData")
    .where("type", "=", "offres_apprentissage")
    .where((eb) =>
      eb.and([
        eb.or([
          eb(sql`"data"->>'Niveau de la formation'`, "like", "3%"),
          eb(sql`"data"->>'Niveau de la formation'`, "like", "4%"),
          eb(sql`"data"->>'Niveau de la formation'`, "like", "5%"),
        ]),
        eb.or([
          eb(sql`"data"->>'Tags'`, "like", "%2023%"),
          eb(sql`"data"->>'Tags'`, "like", "%2024%"),
        ]),
      ])
    )
    .distinctOn(
      sql<string>`data->>'Code du diplome ou du titre suivant la nomenclature de l''Education nationale (CodeEN)'`
    )
    .offset(offset)
    .$call((q) => {
      if (!limit) return q;
      return q.limit(limit);
    })
    .execute();

  return items.map((item) => item.data as Offres_apprentissages);
};
