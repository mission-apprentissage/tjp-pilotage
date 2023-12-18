import { sql } from "kysely";
import { Role } from "shared";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";

export const findUsers = async ({
  offset,
  limit,
  search,
}: {
  offset: number;
  limit: number;
  search?: string;
}) => {
  const users = await kdb
    .selectFrom("user")
    .selectAll()
    .select(kdb.fn.count<number>("id").over().as("count"))
    .where((w) => {
      if (!search) return sql`true`;
      return w("email", "ilike", `%${search}%`)
        .or("firstname", "ilike", `%${search}%`)
        .or("lastname", "ilike", `%${search}%`);
    })
    .$narrowType<{ role: Role }>()
    .offset(offset)
    .limit(limit)
    .orderBy("createdAt", "desc")
    .execute()
    .then(cleanNull);

  return {
    count: users[0]?.count ?? 0,
    users: users.map((user) => ({
      ...user,
      createdAt: user.createdAt?.toISOString(),
    })),
  };
};
