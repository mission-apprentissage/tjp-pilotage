import { sql } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";

import { kdb } from "../../../../db/db";

export const findFormationFromRawDataQuery = async ({
  cfd,
}: {
  cfd: string;
}) => {
  const formation = await kdb
    .selectFrom("formation")
    .selectAll("formation")
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
          .where(sql`"data"->>'FORMATION_DIPLOME'`, "=", `${cfd}`)
          .distinctOn("codeDispositif")
      ).as("dispositifs")
    )
    .where("codeFormationDiplome", "=", cfd)
    .limit(1)
    .executeTakeFirst();

  return formation;
};
