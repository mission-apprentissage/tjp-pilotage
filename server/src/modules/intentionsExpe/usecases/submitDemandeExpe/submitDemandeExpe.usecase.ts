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
import { findOneDemandeExpe } from "../../repositories/findOneDemandeExpe.query";
import { findOneSimilarDemandeExpe } from "../../repositories/findOneSimilarDemandeExpe.query";
import { createDemandeExpeQuery } from "./createDemandeExpe.query";

type demandeExpe = {
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
  besoinRH?: string[];
  autreBesoinRH?: string;
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

const validateDemande = (demandeExpe: demandeExpe) => {
  let errors: Record<string, string> = {};
  for (const [key, validator] of Object.entries(demandeValidators)) {
    const error = validator(demandeExpe);
    if (!error) continue;
    errors = { ...errors, [key]: error };
  }
  return Object.keys(errors).length ? errors : undefined;
};

const logDemande = (demandeExpe?: { statut: string }) => {
  if (!demandeExpe) return;
  switch (demandeExpe.statut) {
    case DemandeStatutEnum.draft:
      logger.info("Projet de demandeExpe enregistré", {
        demandeExpe: demandeExpe,
      });
      break;
    case DemandeStatutEnum.submitted:
      logger.info("demandeExpe validée", { demandeExpe: demandeExpe });
      break;
    case DemandeStatutEnum.refused:
      logger.info("demandeExpe refusée", { demandeExpe: demandeExpe });
      break;
  }
};

export const [submitDemandeExpeUsecase, submitDemandeExpeFactory] = inject(
  {
    createDemandeExpeQuery,
    findOneDataEtablissement,
    findOneDataFormation,
    findOneDemandeExpe,
    findOneSimilarDemandeExpe,
  },
  (deps) =>
    async ({
      demandeExpe,
      user,
    }: {
      user: Pick<RequestUser, "id" | "role" | "codeRegion" | "uais">;
      demandeExpe: demandeExpe;
    }) => {
      const currentDemande = demandeExpe.numero
        ? await deps.findOneDemandeExpe(demandeExpe.numero)
        : undefined;

      const { cfd, uai } = demandeExpe;

      const dataEtablissement = await deps.findOneDataEtablissement({ uai });
      if (!dataEtablissement) throw Boom.badRequest("Code uai non valide");
      if (!dataEtablissement.codeRegion) throw Boom.badData();

      const scope = getPermissionScope(user.role, "intentions-perdir/ecriture");
      const isAllowed = guardScope(scope?.default, {
        uai: () => user.uais?.includes(demandeExpe.uai) ?? false,
        region: () => user.codeRegion === dataEtablissement.codeRegion,
        national: () => true,
      });
      if (!isAllowed) throw Boom.forbidden();

      const sameDemande = await deps.findOneSimilarDemandeExpe({
        ...demandeExpe,
        notNumero: demandeExpe.numero,
      });
      if (sameDemande) {
        logger.info("demandeExpe similaire existante", {
          sameDemande,
          demandeExpe,
        });
        throw Boom.badRequest("demandeExpe similaire existante", {
          id: sameDemande.id,
          errors: {
            same_demande:
              "Une demandeExpe similaire existe avec ces mêmes champs: code diplôme, numéro établissement, dispositif et rentrée scolaire.",
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
        ...demandeExpe,
      };

      const errors = validateDemande(cleanNull(demandeData));
      if (errors) {
        logger.info("demandeExpe incorrecte", {
          errors,
          demandeExpe: demandeData,
        });
        throw Boom.badData("Donnée incorrectes", { errors });
      }

      const created = await deps.createDemandeExpeQuery({
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
