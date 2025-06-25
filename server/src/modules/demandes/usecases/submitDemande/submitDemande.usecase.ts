import * as Boom from "@hapi/boom";
import { demandeValidators, getPermissionScope, guardScope, isAdmin } from "shared";
import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import {PermissionEnum} from 'shared/enum/permissionEnum';
import type { submitDemandeSchema } from "shared/routes/schemas/post.demande.submit.schema";
import type { z } from "zod";

import type { RequestUser } from "@/modules/core/model/User";
import { findOneCampagneQuery } from "@/modules/demandes/repositories/findOneCampagne.query";
import { findOneDataEtablissementQuery } from "@/modules/demandes/repositories/findOneDataEtablissement.query";
import { findOneDataFormationQuery } from "@/modules/demandes/repositories/findOneDataFormation.query";
import { findOneDemandeQuery } from "@/modules/demandes/repositories/findOneDemande.query";
import { findOneSimilarDemandeQuery } from "@/modules/demandes/repositories/findOneSimilarDemande.query";
import { generateId, generateShortId } from "@/modules/utils/generateId";
import logger from "@/services/logger";
import { inject } from "@/utils/inject";
import { cleanNull } from "@/utils/noNull";

import { createChangementStatutQuery } from "./deps/createChangementStatut.dep";
import { createDemandeQuery } from "./deps/createDemande.dep";

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
  case DemandeStatutEnum["proposition"]:
    logger.info(
      {
        demande: demande,
      },
      "[SUBMIT_INTENTION] Proposition enregistrée"
    );
    break;
  case DemandeStatutEnum["demande validée"]:
    logger.info({ demande: demande }, "[SUBMIT_INTENTION] Demande validée");
    break;
  case DemandeStatutEnum["refusée"]:
    logger.info({ demande: demande }, "[SUBMIT_INTENTION] Demande refusée");
    break;
  }
};

const guardCampagne = (campagne: Awaited<ReturnType<typeof findOneCampagneQuery>>) => {
  return campagne && campagne.dateDebut <= new Date() && campagne.dateFin >= new Date() && campagne.statut === CampagneStatutEnum["en cours"];
};

export const [submitDemandeUsecase, submitDemandeFactory] = inject(
  {
    createDemandeQuery,
    createChangementStatutQuery,
    findOneDataEtablissementQuery,
    findOneDataFormationQuery,
    findOneDemandeQuery,
    findOneCampagneQuery,
    findOneSimilarDemandeQuery,
  },
  (deps) =>
    async ({
      demande,
      user,
    }: {
      user: RequestUser;
      demande: Demande;
    }) => {
      const currentDemande = demande.numero ? await deps.findOneDemandeQuery(demande.numero) : undefined;

      const { cfd, uai, campagneId } = demande;

      const dataEtablissement = await deps.findOneDataEtablissementQuery({ uai });
      const campagne = await deps.findOneCampagneQuery({ id: campagneId });
      if (!dataEtablissement) throw Boom.badRequest("Code uai non valide");
      if (!dataEtablissement.codeRegion) throw Boom.badData();

      const scope = getPermissionScope(user.role, PermissionEnum["demande/ecriture"]);
      const isAllowed = guardScope(scope, {
        uai: () => user.uais?.includes(demande.uai) ?? false,
        région: () => user.codeRegion === dataEtablissement.codeRegion,
        national: () => true,
      });
      const isCampagneOpen = guardCampagne(campagne) || isAdmin({ user });

      if (!isCampagneOpen) {
        logger.error(
          {
            demande,
            campagne,
            user
          },
          "[SUBMIT_INTENTION] Demande soumise en dehors d'une campagne ouverte"
        );
        throw Boom.forbidden("Demande soumise en dehors d'une campagne ouverte");
      }
      if (!isAllowed) {
        logger.error(
          {
            demande,
            campagne,
            user
          },
          "[SUBMIT_INTENTION] Demande soumise sur un établissement non autorisée"
        );
        throw Boom.forbidden("Demande soumise sur un établissement non autorisée");
      }

      const sameDemande = await deps.findOneSimilarDemandeQuery({
        ...demande,
        notNumero: demande.numero,
      });
      if (sameDemande) {
        logger.error(
          {
            sameDemande,
            demande,
            user
          },
          "[SUBMIT_INTENTION] Demande similaire existante"
        );
        throw Boom.badRequest("Demande similaire existante", {
          id: sameDemande.id,
          errors: {
            same_demande:
              `Une demande similaire sur la campagne ${campagne!.annee} existe déjà avec ces mêmes champs: code diplôme, numéro établissement, dispositif et rentrée scolaire.`,
          },
        });
      }

      const dataFormation = await deps.findOneDataFormationQuery(cfd);
      if (!dataFormation) {
        logger.error({
          demande,
          cfd,
          user
        }, "[SUBMIT_INTENTION] CFD non valide");
        throw Boom.badRequest("CFD non valide");
      }

      const demandeData = {
        ...currentDemande,
        libelleColoration: null,
        libelleFCIL: null,
        autreMotif: null,
        commentaire: null,
        capaciteScolaireActuelle: 0,
        capaciteScolaire: 0,
        capaciteScolaireColoreeActuelle: 0,
        capaciteScolaireColoree: 0,
        capaciteApprentissageActuelle: 0,
        capaciteApprentissage: 0,
        capaciteApprentissageColoreeActuelle: 0,
        capaciteApprentissageColoree: 0,
        mixte: false,
        ...demande,
      };

      const errors = validateDemande(cleanNull(demandeData));
      if (errors) {
        logger.error(
          {
            errors,
            demande: demandeData,
            user
          },
          "[SUBMIT_INTENTION] Demande incorrecte"
        );
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

      if (created.statut !== currentDemande?.statut) {
        await deps.createChangementStatutQuery({
          id: generateId(),
          demandeNumero: created.numero,
          statutPrecedent: currentDemande?.statut,
          statut: created.statut,
          createdBy: user.id,
          updatedAt: new Date(),
        });
      }

      logDemande(created);
      return created;
    }
);
