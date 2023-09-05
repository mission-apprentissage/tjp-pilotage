import { jsonArrayFrom } from "kysely/helpers/postgres";

import { kdb } from "../../../db/db";
import { cleanNull } from "../../../utils/noNull";

export const findDemande = async ({ id }: { id: string }) => {
  const demande = await kdb
    .selectFrom("demande")
    .selectAll()
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
          .whereRef("demande.cfd", "=", "formationEtablissement.cfd")
          .distinctOn(["dispositif.codeDispositif"])
      ).as("dispositifs")
    )
    .where("id", "=", id)
    .orderBy("createdAt", "asc")
    .limit(1)
    .executeTakeFirst();

  const dispositifId =
    demande?.dispositifId &&
    demande.dispositifs.find(
      (item) => item.codeDispositif === demande?.dispositifId
    )?.codeDispositif;

  return (
    demande &&
    cleanNull({
      ...demande,
      createdAt: demande.createdAt?.toISOString(),
      dispositifId,
    })
  );
};
