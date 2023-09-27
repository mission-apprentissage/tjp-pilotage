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
        etablissement: jsonObjectFrom(
          eb
            .selectFrom("dataEtablissement")
            .selectAll("dataEtablissement")
            .whereRef("dataEtablissement.uai", "=", "demande.uai")
            .limit(1)
        ),
        formation: jsonObjectFrom(
          eb
            .selectFrom("dataFormation")
            .select("libelle")
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
                    "dataFormation.cfd"
                  )
                  .distinctOn("codeDispositif")
              ).as("dispositifs")
            )
            .whereRef("dataFormation.cfd", "=", "demande.cfd")
            .limit(1)
        ),
        etablissementCompensation: jsonObjectFrom(
          eb
            .selectFrom("dataEtablissement")
            .selectAll("dataEtablissement")
            .whereRef("dataEtablissement.uai", "=", "demande.compensationUai")
            .limit(1)
        ),
        formationCompensation: jsonObjectFrom(
          eb
            .selectFrom("dataFormation")
            .select("libelle")
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
                    "dataFormation.cfd"
                  )
                  .distinctOn("codeDispositif")
              ).as("dispositifs")
            )
            .whereRef("dataFormation.cfd", "=", "demande.compensationCfd")
            .limit(1)
        ),
      }).as("metadata"),
    ])
    .where("id", "=", id)
    .orderBy("createdAt", "asc")
    .limit(1)
    .executeTakeFirst();

  const dispositifId =
    demande?.dispositifId &&
    demande.metadata.formation?.dispositifs.find(
      (item) => item.codeDispositif === demande?.dispositifId
    )?.codeDispositif;

  return (
    demande &&
    cleanNull({
      ...demande,
      metadata: cleanNull({
        ...demande.metadata,
        formation: cleanNull(demande.metadata.formation),
        etablissement: cleanNull(demande.metadata.etablissement),
        formationCompensation: cleanNull(
          demande.metadata.formationCompensation
        ),
        etablissementCompensation: cleanNull(
          demande.metadata.etablissementCompensation
        ),
      }),
      createdAt: demande.createdAt?.toISOString(),
      dispositifId,
    })
  );
};
