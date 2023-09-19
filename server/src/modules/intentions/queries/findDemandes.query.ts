import { sql } from "kysely";

import { kdb } from "../../../db/db";
import { cleanNull } from "../../../utils/noNull";

export const findDemandes = async ({
  status,
  codeRegion,
  offset = 0,
  limit = 20,
  orderBy,
}: {
  status?: "draft" | "submitted";
  codeRegion?: string;
  offset?: number;
  limit: number;
  orderBy?: { order: "asc" | "desc"; column: string };
}) => {
  const demandes = await kdb
    .selectFrom("demande")
    .selectAll()
    .select(sql<string>`count(*) over()`.as("count"))
    .$call((eb) => {
      if (status) return eb.where("demande.status", "=", status);
      return eb;
    })
    .$call((q) => {
      if (!orderBy) return q;
      return q.orderBy(
        sql.ref(orderBy.column),
        sql`${sql.raw(orderBy.order)} NULLS LAST`
      );
    })
    .$call((q) => {
      if (!codeRegion) return q;
      return q.where("codeRegion", "=", codeRegion);
    })
    .offset(offset)
    .limit(limit)
    .execute();

  return {
    demandes: demandes.map((item) =>
      cleanNull({ ...item, createdAt: item.createdAt?.toISOString() })
    ),
    count: parseInt(demandes[0]?.count) || 0,
  };
};
