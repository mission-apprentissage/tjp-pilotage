import Boom from "@hapi/boom";
import { inject } from "injecti";
import { demandeValidators, getPermissionScope, guardScope } from "shared";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import { logger } from "../../../../logger";
import { cleanNull } from "../../../../utils/noNull";
import { RequestUser } from "../../../core/model/User";
import { findOneDataEtablissement } from "../../../data/repositories/findOneDataEtablissement.query";
import { generateId, generateShortId } from "../../../utils/generateId";
import { findOneDataFormation } from "../../repositories/findOneDataFormation.query";
import { findOneIntention } from "../../repositories/findOneIntention.query";
import { findOneSimilarIntention } from "../../repositories/findOneSimilarIntention.query";
import { createIntentionQuery } from "./createIntention.query";

type intention = {
  id?: string;
  numero?: string;
  uai: string;
  typeDemande: string;
  cfd: string;
  codeDispositif: string;
  libelleFCIL?: string;
  compensationCfd?: string;
  compensationCodeDispositif?: string;
  compensationUai?: string;
  compensationRentreeScolaire?: number;
  motif: string[];
  autreMotif?: string;
  rentreeScolaire: number;
  amiCma: boolean;
  amiCmaValide?: boolean;
  amiCmaValideAnnee?: string;
  libelleColoration?: string;
  poursuitePedagogique?: boolean;
  commentaire?: string;
  coloration: boolean;
  mixte?: boolean;
  capaciteScolaire?: number;
  capaciteScolaireActuelle?: number;
  capaciteScolaireColoree?: number;
  capaciteApprentissage?: number;
  capaciteApprentissageActuelle?: number;
  capaciteApprentissageColoree?: number;
  statut: "draft" | "submitted" | "refused";
  motifRefus?: string[];
  autreMotifRefus?: string;
  campagneId: string;
};

const validateDemande = (intention: intention) => {
  let errors: Record<string, string> = {};
  for (const [key, validator] of Object.entries(demandeValidators)) {
    const error = validator(intention);
    if (!error) continue;
    errors = { ...errors, [key]: error };
  }
  return Object.keys(errors).length ? errors : undefined;
};

const logDemande = (intention?: { statut: string }) => {
  if (!intention) return;
  switch (intention.statut) {
    case DemandeStatutEnum.draft:
      logger.info("Projet de intention enregistré", {
        intention: intention,
      });
      break;
    case DemandeStatutEnum.submitted:
      logger.info("intention validée", { intention: intention });
      break;
    case DemandeStatutEnum.refused:
      logger.info("intention refusée", { intention: intention });
      break;
  }
};

export const [submitIntentionUsecase, submitIntentionFactory] = inject(
  {
    createIntentionQuery,
    findOneDataEtablissement,
    findOneDataFormation,
    findOneIntention,
    findOneSimilarIntention,
  },
  (deps) =>
    async ({
      intention,
      user,
    }: {
      user: Pick<RequestUser, "id" | "role" | "codeRegion" | "uais">;
      intention: intention;
    }) => {
      const currentDemande = intention.numero
        ? await deps.findOneIntention(intention.numero)
        : undefined;

      const { cfd, uai } = intention;

      const dataEtablissement = await deps.findOneDataEtablissement({ uai });
      if (!dataEtablissement) throw Boom.badRequest("Code uai non valide");
      if (!dataEtablissement.codeRegion) throw Boom.badData();

      const scope = getPermissionScope(user.role, "intentions-perdir/ecriture");
      const isAllowed = guardScope(scope?.default, {
        uai: () => user.uais?.includes(intention.uai) ?? false,
        region: () => user.codeRegion === dataEtablissement.codeRegion,
        national: () => true,
      });
      if (!isAllowed) throw Boom.forbidden();

      const sameDemande = await deps.findOneSimilarIntention({
        ...intention,
        notNumero: intention.numero,
      });
      if (sameDemande) {
        logger.info("intention similaire existante", {
          sameDemande,
          intention,
        });
        throw Boom.badRequest("intention similaire existante", {
          id: sameDemande.id,
          errors: {
            same_demande:
              "Une intention similaire existe avec ces mêmes champs: code diplôme, numéro établissement, dispositif et rentrée scolaire.",
          },
        });
      }

      const dataFormation = await deps.findOneDataFormation({ cfd });
      if (!dataFormation) throw Boom.badRequest("Code diplome non valide");

      const demandeData = {
        ...currentDemande,
        libelleColoration: null,
        libelleFCIL: null,
        autreMotif: null,
        commentaire: null,
        capaciteScolaire: 0,
        capaciteScolaireActuelle: 0,
        capaciteScolaireColoree: 0,
        capaciteApprentissage: 0,
        capaciteApprentissageActuelle: 0,
        capaciteApprentissageColoree: 0,
        mixte: false,
        ...intention,
      };

      const errors = validateDemande(cleanNull(demandeData));
      if (errors) {
        logger.info("intention incorrecte", {
          errors,
          intention: demandeData,
        });
        throw Boom.badData("Donnée incorrectes", { errors });
      }

      const created = await deps.createIntentionQuery({
        ...demandeData,
        id: currentDemande?.id ?? generateId(),
        numero: currentDemande?.numero ?? generateShortId(),
        createurId: currentDemande?.createurId ?? user.id,
        codeAcademie: dataEtablissement.codeAcademie,
        codeRegion: dataEtablissement.codeRegion,
        updatedAt: new Date(),
      });

      logDemande(created);
      return created;
    }
);
