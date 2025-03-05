import * as Boom from "@hapi/boom";
import { sql } from "kysely";
import { jsonArrayFrom, jsonBuildObject, jsonObjectFrom } from "kysely/helpers/postgres";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import { TypeFormationSpecifiqueEnum } from "shared/enum/formationSpecifiqueEnum";

import { getKbdClient } from "@/db/db";
import { findOneCampagneRegionByCampagneId } from "@/modules/intentions/repositories/findOneCampagneRegionByCampagneId.query";
import { castDemandeStatutWithoutSupprimee } from "@/modules/utils/castDemandeStatut";
import {castRaisonCorrection} from '@/modules/utils/castRaisonCorrection';
import { castAvisStatut } from "@/modules/utils/castStatutAvis";
import { castAvisType } from "@/modules/utils/castTypeAvis";
import { castTypeDemande } from "@/modules/utils/castTypeDemande";
import {
  countDifferenceCapaciteApprentissageIntention,
  countDifferenceCapaciteScolaireIntention,
} from "@/modules/utils/countCapacite";
import { formatFormationSpecifique } from "@/modules/utils/formatFormationSpecifique";
import { isAvisVisible } from "@/modules/utils/isAvisVisible";
import { isIntentionNotDeleted, isIntentionSelectable } from "@/modules/utils/isDemandeSelectable";
import { isFormationActionPrioritaire } from "@/modules/utils/isFormationActionPrioritaire";
import { cleanNull } from "@/utils/noNull";

import type { Filters } from "./getIntention.usecase";

export const getIntentionQuery = async ({ numero, user }: Filters) => {
  const intention = await getKbdClient()
    .selectFrom("latestDemandeIntentionView as intention")
    .leftJoin("changementStatut", (join) =>
      join
        .onRef("changementStatut.intentionNumero", "=", "intention.numero")
        .onRef("changementStatut.statut", "=", "intention.statut")
    )
    .innerJoin("user", "user.id", "intention.createdBy")
    .innerJoin("dispositif", "dispositif.codeDispositif", "intention.codeDispositif")
    .innerJoin("dataEtablissement", "dataEtablissement.uai", "intention.uai")
    .innerJoin("departement", "departement.codeDepartement", "dataEtablissement.codeDepartement")
    .innerJoin("dataFormation", "dataFormation.cfd", "intention.cfd")
    .leftJoin("formationScolaireView as formationView", "formationView.cfd", "intention.cfd")
    .leftJoin("suivi", (join) =>
      join.onRef("suivi.intentionNumero", "=", "intention.numero").on("userId", "=", user.id)
    )
    .selectAll("intention")
    .select((eb) => [
      "suivi.id as suiviId",
      jsonObjectFrom(
        eb
          .selectFrom("correction")
          .selectAll("correction")
          .whereRef("correction.intentionNumero", "=", "intention.numero")
          .limit(1)
      ).as("correction"),
      jsonObjectFrom(
        eb
          .selectFrom("user")
          .whereRef("user.id", "=", "intention.createdBy")
          .select((eb) => [
            sql<string>`CONCAT(${eb.ref("user.firstname")}, ' ',${eb.ref("user.lastname")})`.as("fullname"),
            "user.id",
            "user.role",
          ])
      ).as("createdBy"),
      jsonObjectFrom(
        eb
          .selectFrom("user")
          .whereRef("user.id", "=", "intention.updatedBy")
          .select((eb) => [
            sql<string>`CONCAT(${eb.ref("user.firstname")}, ' ',${eb.ref("user.lastname")})`.as("fullname"),
            "user.id",
            "user.role",
          ])
      ).as("updatedBy"),
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
            .leftJoin("niveauDiplome", "niveauDiplome.codeNiveauDiplome", "dataFormation.codeNiveauDiplome")
            .select((ebDataFormation) => [
              sql<string>`CONCAT(
                ${ebDataFormation.ref("formationView.libelleFormation")},
                ' (',
                ${ebDataFormation.ref("niveauDiplome.libelleNiveauDiplome")},
                ')',
                ' (',
                ${ebDataFormation.ref("dataFormation.cfd")},
                ')')
              `.as("libelleFormation"),
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
            .whereRef("dataFormation.cfd", "=", "intention.cfd")
            .limit(1)
        ),
      }).as("metadata"),
      "changementStatut.commentaire as commentaireStatut",
      countDifferenceCapaciteScolaireIntention(eb).as("differenceCapaciteScolaire"),
      countDifferenceCapaciteApprentissageIntention(eb).as("differenceCapaciteApprentissage"),
      "dispositif.libelleDispositif as libelleDispositif",
      "dataFormation.libelleFormation",
      "dataEtablissement.libelleEtablissement",
      "departement.libelleDepartement",
      "departement.codeDepartement",
      isFormationActionPrioritaire({
        cfdRef: "intention.cfd",
        codeDispositifRef: "intention.codeDispositif",
        codeRegionRef: "intention.codeRegion",
      }).as(TypeFormationSpecifiqueEnum["Action prioritaire"]),
      eb.ref("formationView.isTransitionDemographique").as(TypeFormationSpecifiqueEnum["Transition démographique"]),
      eb.ref("formationView.isTransitionEcologique").as(TypeFormationSpecifiqueEnum["Transition écologique"]),
      eb.ref("formationView.isTransitionNumerique").as(TypeFormationSpecifiqueEnum["Transition numérique"]),
    ])
    .where("intention.isIntention", "=", true)
    .where(isIntentionNotDeleted)
    .where(isIntentionSelectable({ user }))
    .where("intention.numero", "=", numero)
    .limit(1)
    .executeTakeFirstOrThrow()
    .then(cleanNull)
    .catch(() => {
      throw Boom.notFound(`Aucune intention trouvée pour le numéro ${numero}`, {
        errors: {
          intention_introuvable: `Aucune demande trouvée pour le numéro ${numero}`,
        },
      });
    });

  const changementsStatut = await getKbdClient()
    .selectFrom("changementStatut")
    .innerJoin("user", "user.id", "changementStatut.createdBy")
    .where((w) =>
      w.and([
        w("changementStatut.intentionNumero", "=", numero),
        w("changementStatut.statut", "<>", DemandeStatutEnum["supprimée"]),
        w("changementStatut.statutPrecedent", "<>", DemandeStatutEnum["supprimée"]),
      ])
    )
    .distinctOn(["changementStatut.updatedAt", "changementStatut.statut", "changementStatut.statutPrecedent"])
    .orderBy("changementStatut.updatedAt", "desc")
    .selectAll("changementStatut")
    .select((eb) => [
      "user.id as createdBy",
      "user.role as userRole",
      sql<string>`CONCAT(${eb.ref("user.firstname")},' ',${eb.ref("user.lastname")})`.as("userFullName"),
    ])
    .execute()
    .then(cleanNull);

  const avis = await getKbdClient()
    .selectFrom("avis")
    .innerJoin("user", "user.id", "avis.createdBy")
    .leftJoin("user as updatedByUser", "updatedByUser.id", "avis.updatedBy")
    .where("avis.intentionNumero", "=", numero)
    .distinctOn(["avis.updatedAt", "avis.typeAvis", "avis.statutAvis", "avis.createdBy"])
    .orderBy("avis.updatedAt", "desc")
    .selectAll("avis")
    .select((eb) => [
      "user.id as createdBy",
      "user.role as userRole",
      sql<string>`CONCAT(${eb.ref("user.firstname")},' ',${eb.ref("user.lastname")})`.as("userFullName"),
      sql<string>`CONCAT(${eb.ref("updatedByUser.firstname")},' ',${eb.ref("updatedByUser.lastname")})`.as(
        "updatedByFullName"
      ),
    ])
    .where(isAvisVisible({ user }))
    .execute()
    .then(cleanNull);

  const campagne =  await findOneCampagneRegionByCampagneId({
    campagneId: intention.campagneId,
    user,
  });

  return {
    ...intention,
    campagne,
    metadata: {
      ...intention.metadata,
      formation: intention.metadata.formation,
      etablissement: intention.metadata.etablissement,
    },
    createdAt: intention.createdAt?.toISOString(),
    updatedAt: intention.updatedAt?.toISOString(),
    statut: castDemandeStatutWithoutSupprimee(intention.statut),
    typeDemande: castTypeDemande(intention.typeDemande),
    changementsStatut: changementsStatut.map((changementStatut) => ({
      ...changementStatut,
      statut: castDemandeStatutWithoutSupprimee(changementStatut.statut),
      statutPrecedent: castDemandeStatutWithoutSupprimee(changementStatut.statutPrecedent),
      updatedAt: changementStatut.updatedAt?.toISOString(),
    })),
    avis: avis.map((avis) => ({
      ...avis,
      createdAt: avis.createdAt?.toISOString(),
      updatedAt: avis.updatedAt?.toISOString(),
      updatedByFullName: avis.updatedByFullName.trim() ?? null,
      statutAvis: castAvisStatut(avis.statutAvis),
      typeAvis: castAvisType(avis.typeAvis),
    })),
    correction: intention.correction ? {
      ...intention.correction,
      raison: castRaisonCorrection(intention.correction?.raison),
    }: undefined,
    formationSpecifique: formatFormationSpecifique(intention),
  };
};
