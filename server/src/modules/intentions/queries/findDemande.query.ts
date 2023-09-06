import { sql } from "kysely";
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
            .whereRef(sql`"data"->>'FORMATION_DIPLOME'`, "=", "demande.cfd")
            .distinctOn("codeDispositif")
        ),
        etablissement: jsonObjectFrom(
          eb
            .selectFrom("rawData")
            .select([
              sql<string>`"data"->>'appellation_officielle'`.as(
                "libelleEtablissement"
              ),
              sql<string>`"data"->>'commune_libe'`.as("commune"),
            ])
            .whereRef(sql`"data"->>'numero_uai'`, "=", "demande.uai")
            .where("type", "=", "lyceesACCE")
            .limit(1)
        ),
        libelleDiplome: eb
          .selectFrom("formation")
          .select("libelleDiplome")
          .whereRef("formation.codeFormationDiplome", "=", "demande.cfd")
          .limit(1)
          .$castTo<string | null>(),
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
