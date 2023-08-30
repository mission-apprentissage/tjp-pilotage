import { jsonArrayFrom } from "kysely/helpers/postgres";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";

export const findFormationQuery = async ({ cfd }: { cfd: string }) => {
  const formation = await kdb
    .selectFrom("formation")

    .selectAll("formation")
    .select((eb) =>
      jsonArrayFrom(
        eb
          .selectFrom("formationEtablissement")
          .innerJoin(
            "dispositif",
            "formationEtablissement.dispositifId",
            "dispositif.codeDispositif"
          )
          .select(["codeDispositif", "libelleDispositif"])
          .whereRef(
            "formation.codeFormationDiplome",
            "=",
            "formationEtablissement.cfd"
          )
          .distinctOn(["dispositif.codeDispositif"])
      ).as("dispositifs")
    )

    .where("codeFormationDiplome", "=", cfd)

    .limit(1)
    .executeTakeFirst();
  return (
    formation &&
    cleanNull({
      ...formation,
      dispositifs: formation.dispositifs.map(cleanNull),
    })
  );
};
