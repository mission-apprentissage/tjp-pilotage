import {
  jsonArrayFrom,
  jsonBuildObject,
  jsonObjectFrom,
} from "kysely/helpers/postgres";

import { kdb } from "../../../db/db";
import { cleanNull } from "../../../utils/noNull";

export const findDemande = async ({ id }: { id: string }) => {
  const demande = await kdb
    .selectFrom("demande")
    .selectAll()
    .select((eb) => [
      jsonBuildObject({
        dispositifs: jsonArrayFrom(
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
        ),
        etablissement: jsonObjectFrom(
          eb
            .selectFrom("etablissement")
            .select([
              "etablissement.libelleEtablissement",
              "etablissement.commune",
            ])
            .whereRef("etablissement.UAI", "=", "demande.uai")
        ),
      }).as("metadata"),
    ])
    .where("id", "=", id)
    .orderBy("createdAt", "asc")
    .limit(1)
    .executeTakeFirst();

  const dispositifId =
    demande?.dispositifId &&
    demande.metadata.dispositifs.find(
      (item) => item.codeDispositif === demande?.dispositifId
    )?.codeDispositif;

  return (
    demande &&
    cleanNull({
      ...demande,
      metadata: cleanNull({
        ...demande.metadata,
        etablissement: cleanNull(demande.metadata.etablissement),
      }),
      createdAt: demande.createdAt?.toISOString(),
      dispositifId,
    })
  );
};
