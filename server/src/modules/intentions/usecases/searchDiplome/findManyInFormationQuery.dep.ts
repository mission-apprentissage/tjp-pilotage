import { sql } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";

import { kdb } from "../../../../db/db";

export const findManyInFormationQuery = async ({
  search,
}: {
  search: string;
}) => {
  const formation = await kdb
    .selectFrom("formation")
    .select([
      "formation.codeFormationDiplome as value",
      "formation.libelleDiplome as label",
    ])
    .select((eb) =>
      jsonArrayFrom(
        eb
          .selectFrom("dispositif")
          .select(["libelleDispositif", "codeDispositif"])
          .leftJoin("rawData", (join) =>
            join
              .onRef(
                sql`"data"->>'DISPOSITIF_FORMATION'`,
                "=",
                "dispositif.codeDispositif"
              )
              .on("rawData.type", "=", "nMef")
          )
          .whereRef(
            sql`"data"->>'FORMATION_DIPLOME'`,
            "=",
            "codeFormationDiplome"
          )
          .distinctOn("codeDispositif")
      ).as("dispositifs")
    )
    .where((eb) =>
      eb.or([
        eb("formation.codeFormationDiplome", "ilike", `${search}%`),
        eb("formation.libelleDiplome", "ilike", `%${search}%`),
      ])
    )
    .limit(10)
    .execute();
  return formation;
};
