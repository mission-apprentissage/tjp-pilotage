import * as Boom from "@hapi/boom";
import { sql } from "kysely";
import { jsonArrayFrom, jsonBuildObject, jsonObjectFrom } from "kysely/helpers/postgres";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import { TypeFormationSpecifiqueEnum } from "shared/enum/formationSpecifiqueEnum";

import { getKbdClient } from "@/db/db";
import { findOneCampagneRegionByCampagneId } from "@/modules/demandes/repositories/findOneCampagneRegionByCampagneId.query";
import { castDemandeStatutWithoutSupprimee } from "@/modules/utils/castDemandeStatut";
import {castRaisonCorrection} from '@/modules/utils/castRaisonCorrection';
import { castAvisStatut } from "@/modules/utils/castStatutAvis";
import { castAvisType } from "@/modules/utils/castTypeAvis";
import { castTypeDemande } from "@/modules/utils/castTypeDemande";
import {
  countDifferenceCapaciteApprentissage,
  countDifferenceCapaciteScolaire,
} from "@/modules/utils/countCapacite";
import { formatFormationSpecifique } from "@/modules/utils/formatFormationSpecifique";
import { isAvisVisible } from "@/modules/utils/isAvisVisible";
import { isDemandeNotDeleted,isDemandeSelectable } from "@/modules/utils/isDemandeSelectable";
import { isFormationActionPrioritaire } from "@/modules/utils/isFormationActionPrioritaire";
import { cleanNull } from "@/utils/noNull";

import type { Filters } from "./getDemande.usecase";

export const getDemandeQuery = async ({ numero, user }: Filters) => {

  const demande = await getKbdClient()
    .selectFrom("latestDemandeView as demande")
    .innerJoin("dataFormation", "dataFormation.cfd", "demande.cfd")
    .leftJoin("formationScolaireView as formationView", "formationView.cfd", "demande.cfd")
    .leftJoin("changementStatut", (join) =>
      join
        .onRef("changementStatut.demandeNumero", "=", "demande.numero")
        .onRef("changementStatut.statut", "=", "demande.statut")
    )
    .innerJoin("user", "user.id", "demande.createdBy")
    .innerJoin("dispositif", "dispositif.codeDispositif", "demande.codeDispositif")
    .innerJoin("dataEtablissement", "dataEtablissement.uai", "demande.uai")
    .innerJoin("departement", "departement.codeDepartement", "dataEtablissement.codeDepartement")
    .leftJoin("suivi", (join) =>
      join.onRef("suivi.demandeNumero", "=", "demande.numero").on("userId", "=", user.id)
    )
    .selectAll("demande")
    .select((eb) => [
      "suivi.id as suiviId",
      "changementStatut.commentaire as commentaireStatut",
      "dispositif.libelleDispositif as libelleDispositif",
      "dataFormation.libelleFormation",
      "dataEtablissement.libelleEtablissement",
      "departement.libelleDepartement",
      "departement.codeDepartement",
      jsonObjectFrom(
        eb
          .selectFrom("correction")
          .selectAll("correction")
          .whereRef("correction.demandeNumero", "=", "demande.numero")
          .limit(1)
      ).as("correction"),
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
            .select((eb) => [
              sql<string>`CONCAT(
                ${eb.ref("formationView.libelleFormation")},
                ' (',
                ${eb.ref("niveauDiplome.libelleNiveauDiplome")},
                ')',
                ' (',
                ${eb.ref("dataFormation.cfd")},
                ')')
              `.as("libelleFormation"),
              sql<boolean>`${eb("dataFormation.codeNiveauDiplome", "in", ["381", "481", "581"])}`.as(
                "isFCIL"
              ),
              sql<boolean>`${eb("dataFormation.dateFermeture", "is not", null)}`.as(
                "isEnRenovation"
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
      }).as("metadata"),
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

  const changementsStatut = await getKbdClient()
    .selectFrom("changementStatut")
    .innerJoin("user", "user.id", "changementStatut.createdBy")
    .where((w) =>
      w.and([
        w("changementStatut.demandeNumero", "=", numero),
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
    .where("avis.demandeNumero", "=", numero)
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
    campagneId: demande.campagneId,
    user,
  });

  return {
    ...demande,
    campagne,
    metadata: {
      ...demande.metadata,
      formation: demande.metadata.formation,
      etablissement: demande.metadata.etablissement,
    },
    createdAt: demande.createdAt?.toISOString(),
    updatedAt: demande.updatedAt?.toISOString(),
    statut: castDemandeStatutWithoutSupprimee(demande.statut),
    typeDemande: castTypeDemande(demande.typeDemande),
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
    correction: demande.correction ? {
      ...demande.correction,
      raison: castRaisonCorrection(demande.correction?.raison),
    }: undefined,
    formationSpecifique: formatFormationSpecifique(demande),
    isOldDemande: demande.isOldDemande ?? false,
  };
};
