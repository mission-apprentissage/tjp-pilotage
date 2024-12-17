import { sql } from "kysely";

import { getKbdClient } from "@/db/db";

export const countUsersToAnonymiseQuery = async () =>
  await getKbdClient()
    .selectFrom("user")
    .select((eb) =>
      eb.fn
        .coalesce(
          eb.fn.sum<number>(
            eb
              .case()
              .when(sql`COALESCE(${sql.ref("lastSeenAt")}, ${sql.ref("createdAt")}) < NOW() - INTERVAL '2 years'`)
              .then(1)
              .else(0)
              .end()
          ),
          eb.val(0)
        )
        .as("count")
    )
    .executeTakeFirstOrThrow();

export const anonymiseUsersQuery = async () => {
  await sql`
    UPDATE ${sql.table("user")}
    SET
        email = CONCAT('anonyme_', ${sql.ref("user.id")}, '@orion.inserjeunes.beta.gouv.fr'),
        firstname = 'Utilisateur',
        lastname = 'Anonyme',
        password = NULL,
        enabled = false
    WHERE COALESCE(${sql.ref("user.lastSeenAt")}, ${sql.ref("user.createdAt")}) < NOW() - INTERVAL '2 years';
  `.execute(getKbdClient());
};
