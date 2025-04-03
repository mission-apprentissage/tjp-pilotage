import { sql } from "kysely";

import { getKbdClient } from "@/db/db";

export const findOffresApprentissages = async ({ offset, limit }: { offset: number; limit: number }) => {
  const items = await getKbdClient()
    .selectFrom("rawData")
    .select(sql<string>`data->>'Formation: code CFD'`.as("cfd"))
    .where("type", "=", "offres_apprentissage")
    .where((eb) =>
      eb.and([
        eb.or([
          eb(sql`"data"->>'Formation: code CFD'`, "like", "3%"),
          eb(sql`"data"->>'Formation: code CFD'`, "like", "4%"),
          eb(sql`"data"->>'Formation: code CFD'`, "like", "5%"),
        ])
      ])
    )
    .offset(offset)
    .$call((q) => {
      if (!limit) return q;
      return q.limit(limit);
    })
    .distinct()
    .execute();

  return items.map((item) => item.cfd);
};
