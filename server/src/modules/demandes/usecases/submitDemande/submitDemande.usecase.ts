import Boom from "@hapi/boom";
// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";
import { demandeValidators, getPermissionScope, guardScope } from "shared";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import { DemandeTypeEnum } from "shared/enum/demandeTypeEnum";
import type { submitDemandeSchema } from "shared/routes/schemas/post.demande.submit.schema";
import type { z } from "zod";

import type { RequestUser } from "@/modules/core/model/User";
import { findOneDataEtablissement } from "@/modules/data/repositories/findOneDataEtablissement.query";
import { findOneDataFormation } from "@/modules/demandes/repositories/findOneDataFormation.query";
import { findOneDemandeQuery } from "@/modules/demandes/repositories/findOneDemande.query";
import { findOneSimilarDemande } from "@/modules/demandes/repositories/findOneSimilarDemande.query";
import { generateId, generateShortId } from "@/modules/utils/generateId";
import logger from "@/services/logger";
import { cleanNull } from "@/utils/noNull";

import { createDemandeQuery } from "./createDemandeQuery.dep";

type Demande = z.infer<typeof submitDemandeSchema.body>["demande"];

const validateDemande = (demande: Demande) => {
  let errors: Record<string, string> = {};
  for (const [key, validator] of Object.entries(demandeValidators)) {
    const error = validator(demande);
    if (!error) continue;
    errors = { ...errors, [key]: error };
  }
  return Object.keys(errors).length ? errors : undefined;
};

const logDemande = (demande?: { statut: string }) => {
  if (!demande) return;
  switch (demande.statut) {
  case DemandeStatutEnum["projet de demande"]:
    logger.info({ demande: demande }, "[SUBMIT_DEMANDE] Projet de demande enregistré");
    break;
  case DemandeStatutEnum["demande validée"]:
    logger.info({ demande: demande }, "[SUBMIT_DEMANDE] Demande validée");
    break;
  case DemandeStatutEnum["refusée"]:
    logger.info({ demande: demande }, "[SUBMIT_DEMANDE] Demande refusée");
    break;
  }
};

export const [submitDemande, submitDemandeFactory] = inject(
  {
    createDemandeQuery,
    findOneDataEtablissement,
    findOneDataFormation,
    findOneDemandeQuery,
    findOneSimilarDemande,
  },
  (deps) =>
    async ({ demande, user }: { user: RequestUser; demande: Demande }) => {
      const currentDemande = demande.numero ? await deps.findOneDemandeQuery(demande.numero) : undefined;

      const { cfd, uai } = demande;

      const dataEtablissement = await deps.findOneDataEtablissement({ uai });
      if (!dataEtablissement) {
        logger.error(
          {
            demande,
            user
          },
          "[SUBMIT_DEMANDE] Code uai non valide"
        );
        throw Boom.badRequest("Code uai non valide");
      }
      if (!dataEtablissement.codeRegion) throw Boom.badData();

      const scope = getPermissionScope(user.role, "intentions/ecriture");
      const isAllowed = guardScope(scope, {
        région: () => user.codeRegion === dataEtablissement.codeRegion,
        national: () => true,
      });
      if (!isAllowed) throw Boom.forbidden();

      const sameDemande = await deps.findOneSimilarDemande({
        ...demande,
        notNumero: demande.numero,
      });
      if (sameDemande) {
        logger.error({ sameDemande, demande, user }, "[SUBMIT_DEMANDE] Demande similaire existante");
        throw Boom.badRequest("Demande similaire existante", {
          id: sameDemande.id,
          errors: {
            same_demande:
              "Une demande similaire existe avec ces mêmes champs: code diplôme, numéro établissement, dispositif et rentrée scolaire.",
          },
        });
      }

      const compensationRentreeScolaire =
        demande.typeDemande === DemandeTypeEnum["augmentation_compensation"] ||
        demande.typeDemande === DemandeTypeEnum["ouverture_compensation"]
          ? demande.rentreeScolaire
          : undefined;

      const dataFormation = await deps.findOneDataFormation({ cfd });
      if (!dataFormation) {
        logger.error({ demande, user }, "[SUBMIT_DEMANDE] CFD non valide");
        throw Boom.badRequest("CFD non valide");
      }

      const demandeData = {
        ...currentDemande,
        libelleColoration: null,
        libelleFCIL: null,
        autreMotif: null,
        commentaire: null,
        compensationCfd: null,
        compensationCodeDispositif: null,
        compensationUai: null,
        capaciteScolaireActuelle: 0,
        capaciteScolaire: 0,
        capaciteScolaireColoreeActuelle: 0,
        capaciteScolaireColoree: 0,
        capaciteApprentissageActuelle: 0,
        capaciteApprentissage: 0,
        capaciteApprentissageColoreeActuelle: 0,
        capaciteApprentissageColoree: 0,
        mixte: false,
        poursuitePedagogique: false,
        compensationRentreeScolaire,
        ...demande,
      };

      const errors = validateDemande(cleanNull(demandeData));
      if (errors) {
        logger.error({ errors, demande: demandeData, user }, "[SUBMIT_DEMANDE] Donnée incorrectes");
        throw Boom.badData("Donnée incorrectes", { errors });
      }

      const created = await deps.createDemandeQuery({
        ...demandeData,
        id: currentDemande?.id ?? generateId(),
        numero: currentDemande?.numero ?? generateShortId(),
        createdBy: currentDemande?.createdBy ?? user.id,
        updatedBy: user.id,
        codeAcademie: dataEtablissement.codeAcademie,
        codeRegion: dataEtablissement.codeRegion,
        updatedAt: new Date(),
      });

      logDemande(created);
      return created;
    }
);
