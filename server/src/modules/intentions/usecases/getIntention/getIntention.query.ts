import { sql } from "kysely";
import {
  jsonArrayFrom,
  jsonBuildObject,
  jsonObjectFrom,
} from "kysely/helpers/postgres";
import { z } from "zod";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";
import { RequestUser } from "../../../core/model/User";
import {
  isIntentionNotDeleted,
  isIntentionSelectable,
} from "../../../utils/isDemandeSelectable";
import { getIntentionSchema } from "./getIntention.schema";

export interface Filters extends z.infer<typeof getIntentionSchema.params> {
  user: RequestUser;
}

export const getIntentionQuery = async ({ numero, user }: Filters) => {
  const intention = await kdb
    .selectFrom("latestIntentionView as intention")
    .leftJoin("changementStatut", (join) =>
      join
        .onRef("changementStatut.intentionNumero", "=", "intention.numero")
        .onRef("changementStatut.statut", "=", "intention.statut")
    )
    .selectAll()
    .select((eb) => [
      jsonObjectFrom(
        eb
          .selectFrom("campagne")
          .selectAll("campagne")
          .whereRef("campagne.id", "=", "intention.campagneId")
          .limit(1)
      ).as("campagne"),
      jsonBuildObject({
        etablissement: jsonObjectFrom(
          eb
            .selectFrom("dataEtablissement")
            .selectAll("dataEtablissement")
            .whereRef("dataEtablissement.uai", "=", "intention.uai")
            .limit(1)
        ),
        formation: jsonObjectFrom(
          eb
            .selectFrom("dataFormation")
            .leftJoin(
              "niveauDiplome",
              "niveauDiplome.codeNiveauDiplome",
              "dataFormation.codeNiveauDiplome"
            )
            .select((ebDataFormation) => [
              sql<string>`CONCAT(${ebDataFormation.ref(
                "dataFormation.libelleFormation"
              )},
              ' (',${ebDataFormation.ref(
                "niveauDiplome.libelleNiveauDiplome"
              )},')',
              ' (',${ebDataFormation.ref("dataFormation.cfd")},')')`.as(
                "libelleFormation"
              ),
              sql<boolean>`${ebDataFormation(
                "dataFormation.codeNiveauDiplome",
                "in",
                ["381", "481", "581"]
              )}`.as("isFCIL"),
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
                    "dataFormation.cfd"
                  )
                  .distinctOn("codeDispositif")
              ).as("dispositifs")
            )
            .whereRef("dataFormation.cfd", "=", "intention.cfd")
            .limit(1)
        ),
      }).as("metadata"),
    ])
    .select("changementStatut.commentaire as commentaireStatut")
    .where(isIntentionNotDeleted)
    .where(isIntentionSelectable({ user }))
    .where("intention.numero", "=", numero)
    .limit(1)
    .executeTakeFirst();

  const changementsStatut = await kdb
    .selectFrom("changementStatut")
    .innerJoin("user", "user.id", "changementStatut.userId")
    .where("changementStatut.intentionNumero", "=", numero)
    .distinctOn([
      "changementStatut.updatedAt",
      "changementStatut.statut",
      "changementStatut.statutPrecedent",
    ])
    .orderBy("changementStatut.updatedAt", "desc")
    .selectAll("changementStatut")
    .select((eb) => [
      "user.id as userId",
      "user.role as userRole",
      sql<string>`CONCAT(${eb.ref("user.firstname")},' ',${eb.ref(
        "user.lastname"
      )})`.as("userFullName"),
    ])
    .execute();

  const codeDispositif =
    intention?.codeDispositif &&
    intention.metadata.formation?.dispositifs.find(
      (item) => item.codeDispositif === intention?.codeDispositif
    )?.codeDispositif;

  return (
    intention &&
    cleanNull({
      ...intention,
      metadata: cleanNull({
        ...intention.metadata,
        formation: cleanNull(intention.metadata.formation),
        etablissement: cleanNull(intention.metadata.etablissement),
      }),
      createdAt: intention.createdAt?.toISOString(),
      campagne: cleanNull({
        ...intention.campagne,
      }),
      codeDispositif,
      changementsStatut: changementsStatut.map((item) => ({
        ...item,
        updatedAt: item.updatedAt?.toISOString(),
      })),
    })
  );
};
