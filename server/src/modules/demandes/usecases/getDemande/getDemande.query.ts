import * as Boom from "@hapi/boom";
import { sql } from "kysely";
import { jsonArrayFrom, jsonBuildObject, jsonObjectFrom } from "kysely/helpers/postgres";
import { TypeFormationSpecifiqueEnum } from "shared/enum/formationSpecifiqueEnum";
import type { getDemandeSchema } from "shared/routes/schemas/get.demande.numero.schema";
import type { z } from "zod";

import { getKbdClient } from "@/db/db";
import type { RequestUser } from "@/modules/core/model/User";
import { castDemandeStatutWithoutSupprimee } from "@/modules/utils/castDemandeStatut";
import { countDifferenceCapaciteApprentissage, countDifferenceCapaciteScolaire } from "@/modules/utils/countCapacite";
import { formatFormationSpecifique } from "@/modules/utils/formatFormationSpecifique";
import { isDemandeNotDeleted, isDemandeSelectable } from "@/modules/utils/isDemandeSelectable";
import { isFormationActionPrioritaire } from "@/modules/utils/isFormationActionPrioritaire";
import { cleanNull } from "@/utils/noNull";

export interface Filters extends z.infer<typeof getDemandeSchema.params> {
  user: RequestUser;
}

export const getDemandeQuery = async ({ numero, user }: Filters) => {
  const demande = await getKbdClient()
    .selectFrom("latestDemandeView as demande")
    .leftJoin("formationScolaireView as formationView", "formationView.cfd", "demande.cfd")
    .innerJoin("dataFormation", "dataFormation.cfd", "demande.cfd")
    .innerJoin("dispositif", "dispositif.codeDispositif", "demande.codeDispositif")
    .innerJoin("dataEtablissement", "dataEtablissement.uai", "demande.uai")
    .innerJoin("departement", "departement.codeDepartement", "dataEtablissement.codeDepartement")
    .selectAll()
    .select((eb) => [
      "dispositif.libelleDispositif",
      "dataFormation.libelleFormation",
      "dataEtablissement.libelleEtablissement",
      "departement.libelleDepartement",
      "departement.codeDepartement",
      jsonObjectFrom(
        eb
          .selectFrom("correction")
          .selectAll("correction")
          .whereRef("correction.intentionNumero", "=", "demande.numero")
          .limit(1)
      ).as("correction"),
      jsonObjectFrom(
        eb.selectFrom("campagne").selectAll("campagne").whereRef("campagne.id", "=", "demande.campagneId").limit(1)
      ).as("campagne"),
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
            .leftJoin("niveauDiplome", "niveauDiplome.codeNiveauDiplome", "dataFormation.codeNiveauDiplome")
            .select((ebDataFormation) => [
              sql<string>`CONCAT(${ebDataFormation.ref("dataFormation.libelleFormation")},
              ' (',${ebDataFormation.ref("niveauDiplome.libelleNiveauDiplome")},')',
              ' (',${ebDataFormation.ref("dataFormation.cfd")},')')`.as("libelleFormation"),
              sql<boolean>`${ebDataFormation("dataFormation.codeNiveauDiplome", "in", ["381", "481", "581"])}`.as(
                "isFCIL"
              ),
            ])
            .select((eb) =>
              jsonArrayFrom(
                eb
                  .selectFrom("dispositif")
                  .select(["libelleDispositif", "codeDispositif"])
                  .leftJoin("rawData", (join) =>
                    join
                      .onRef(sql`"data"->>'DISPOSITIF_FORMATION'`, "=", "dispositif.codeDispositif")
                      .on("rawData.type", "=", "nMef")
                  )
                  .whereRef(sql`"data"->>'FORMATION_DIPLOME'`, "=", "dataFormation.cfd")
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
            .leftJoin("niveauDiplome", "niveauDiplome.codeNiveauDiplome", "dataFormation.codeNiveauDiplome")
            .select((ebDataFormation) => [
              sql<string>`CONCAT(${ebDataFormation.ref("dataFormation.libelleFormation")},
              ' (',${ebDataFormation.ref("niveauDiplome.libelleNiveauDiplome")},')',
              ' (',${ebDataFormation.ref("dataFormation.cfd")},')')`.as("libelleFormation"),
              sql<boolean>`${ebDataFormation("dataFormation.codeNiveauDiplome", "in", ["381", "481", "581"])}`.as(
                "isFCIL"
              ),
            ])
            .select((eb) =>
              jsonArrayFrom(
                eb
                  .selectFrom("dispositif")
                  .select(["libelleDispositif", "codeDispositif"])
                  .leftJoin("rawData", (join) =>
                    join
                      .onRef(sql`"data"->>'DISPOSITIF_FORMATION'`, "=", "dispositif.codeDispositif")
                      .on("rawData.type", "=", "nMef")
                  )
                  .whereRef(sql`"data"->>'FORMATION_DIPLOME'`, "=", "dataFormation.cfd")
                  .distinctOn("codeDispositif")
              ).as("dispositifs")
            )
            .whereRef("dataFormation.cfd", "=", "demande.compensationCfd")
            .limit(1)
        ),
      }).as("metadata"),
      jsonObjectFrom(
        eb
          .selectFrom("user")
          .whereRef("user.id", "=", "demande.createdBy")
          .select((eb) => [
            sql<string>`CONCAT(${eb.ref("user.firstname")}, ' ',${eb.ref("user.lastname")})`.as("fullname"),
            "user.id",
            "user.role",
          ])
      ).as("createdBy"),
      jsonObjectFrom(
        eb
          .selectFrom("user")
          .whereRef("user.id", "=", "demande.updatedBy")
          .select((eb) => [
            sql<string>`CONCAT(${eb.ref("user.firstname")}, ' ',${eb.ref("user.lastname")})`.as("fullname"),
            "user.id",
            "user.role",
          ])
      ).as("updatedBy"),
      countDifferenceCapaciteScolaire(eb).as("differenceCapaciteScolaire"),
      countDifferenceCapaciteApprentissage(eb).as("differenceCapaciteApprentissage"),
      isFormationActionPrioritaire({
        cfdRef: "demande.cfd",
        codeDispositifRef: "demande.codeDispositif",
        codeRegionRef: "demande.codeRegion",
      }).as(TypeFormationSpecifiqueEnum["Action prioritaire"]),
      eb.ref("formationView.isTransitionDemographique").as(TypeFormationSpecifiqueEnum["Transition démographique"]),
      eb.ref("formationView.isTransitionEcologique").as(TypeFormationSpecifiqueEnum["Transition écologique"]),
      eb.ref("formationView.isTransitionNumerique").as(TypeFormationSpecifiqueEnum["Transition numérique"]),
    ])
    .where(isDemandeNotDeleted)
    .where(isDemandeSelectable({ user }))
    .where("demande.numero", "=", numero)
    .orderBy("createdAt", "asc")
    .limit(1)
    .executeTakeFirstOrThrow()
    .then(cleanNull)
    .catch(() => {
      throw Boom.notFound(`Aucune demande trouvée pour le numéro ${numero}`, {
        errors: {
          demande_introuvable: `Aucune demande trouvée pour le numéro ${numero}`,
        },
      });
    });

  const codeDispositif =
    demande?.codeDispositif &&
    demande.metadata.formation?.dispositifs.find((item) => item.codeDispositif === demande?.codeDispositif)
      ?.codeDispositif;

  return (
    demande && {
      ...demande,
      metadata: {
        ...demande.metadata,
        formation: demande.metadata.formation,
        etablissement: demande.metadata.etablissement,
        formationCompensation: demande.metadata.formationCompensation,
        etablissementCompensation: demande.metadata.etablissementCompensation,
      },
      statut: castDemandeStatutWithoutSupprimee(demande.statut),
      createdAt: demande.createdAt?.toISOString(),
      updatedAt: demande.updatedAt?.toISOString(),
      campagne: {
        ...demande.campagne,
      },
      codeDispositif,
      formationSpecifique: formatFormationSpecifique(demande),
    }
  );
};
