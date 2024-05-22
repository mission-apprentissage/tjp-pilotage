import { sql } from "kysely";
import {
  jsonArrayFrom,
  jsonBuildObject,
  jsonObjectFrom,
} from "kysely/helpers/postgres";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import { z } from "zod";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";
import { RequestUser } from "../../../core/model/User";
import { castDemandeStatutWithoutSupprimee } from "../../../utils/castDemandeStatut";
import {
  countDifferenceCapaciteApprentissageIntention,
  countDifferenceCapaciteScolaireIntention,
} from "../../../utils/countCapacite";
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
    .innerJoin("user", "user.id", "intention.createdBy")
    .innerJoin(
      "dispositif",
      "dispositif.codeDispositif",
      "intention.codeDispositif"
    )
    .innerJoin("dataFormation", "dataFormation.cfd", "intention.cfd")
    .innerJoin("dataEtablissement", "dataEtablissement.uai", "intention.uai")
    .innerJoin(
      "departement",
      "departement.codeDepartement",
      "dataEtablissement.codeDepartement"
    )
    .selectAll("intention")
    .select((eb) => [
      jsonObjectFrom(
        eb
          .selectFrom("user")
          .whereRef("user.id", "=", "intention.createdBy")
          .select((eb) => [
            sql<string>`CONCAT(${eb.ref("user.firstname")}, ' ',${eb.ref(
              "user.lastname"
            )})`.as("fullname"),
            "user.id",
            "user.role",
          ])
      ).as("createdBy"),
      jsonObjectFrom(
        eb
          .selectFrom("user")
          .whereRef("user.id", "=", "intention.updatedBy")
          .select((eb) => [
            sql<string>`CONCAT(${eb.ref("user.firstname")}, ' ',${eb.ref(
              "user.lastname"
            )})`.as("fullname"),
            "user.id",
            "user.role",
          ])
      ).as("updatedBy"),
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
      "changementStatut.commentaire as commentaireStatut",
      countDifferenceCapaciteScolaireIntention(eb).as(
        "differenceCapaciteScolaire"
      ),
      countDifferenceCapaciteApprentissageIntention(eb).as(
        "differenceCapaciteApprentissage"
      ),
      "dispositif.libelleDispositif as libelleDispositif",
      "dataFormation.libelleFormation",
      "dataEtablissement.libelleEtablissement",
      "departement.libelleDepartement",
    ])
    .where(isIntentionNotDeleted)
    .where(isIntentionSelectable({ user }))
    .where("intention.numero", "=", numero)
    .limit(1)
    .executeTakeFirst();

  const changementsStatut = await kdb
    .selectFrom("changementStatut")
    .innerJoin("user", "user.id", "changementStatut.userId")
    .where((w) =>
      w.and([
        w("changementStatut.intentionNumero", "=", numero),
        w("changementStatut.statut", "<>", DemandeStatutEnum["supprimée"]),
        w(
          "changementStatut.statutPrecedent",
          "<>",
          DemandeStatutEnum["supprimée"]
        ),
      ])
    )
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
      updatedAt: intention.updatedAt?.toISOString(),
      campagne: cleanNull({
        ...intention.campagne,
      }),
      statut: castDemandeStatutWithoutSupprimee(intention.statut),
      codeDispositif,
      changementsStatut: changementsStatut.map((changementStatut) => ({
        ...changementStatut,
        statut: castDemandeStatutWithoutSupprimee(changementStatut.statut),
        statutPrecedent: castDemandeStatutWithoutSupprimee(
          changementStatut.statutPrecedent
        ),
        updatedAt: changementStatut.updatedAt?.toISOString(),
      })),
    })
  );
};
