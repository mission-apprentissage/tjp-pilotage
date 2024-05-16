import Boom from "@hapi/boom";
import { inject } from "injecti";
import { demandeValidators, getPermissionScope, guardScope } from "shared";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import { z } from "zod";

import { logger } from "../../../../logger";
import { cleanNull } from "../../../../utils/noNull";
import { RequestUser } from "../../../core/model/User";
import { findOneDataEtablissement } from "../../../data/repositories/findOneDataEtablissement.query";
import { generateId, generateShortId } from "../../../utils/generateId";
import { findOneDataFormation } from "../../repositories/findOneDataFormation.query";
import { findOneDemande } from "../../repositories/findOneDemande.query";
import { findOneSimilarDemande } from "../../repositories/findOneSimilarDemande.query";
import { createDemandeQuery } from "./createDemandeQuery.dep";
import { submitDemandeSchema } from "./submitDemande.schema";

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
      logger.info("Projet de demande enregistré", { demande: demande });
      break;
    case DemandeStatutEnum["demande validée"]:
      logger.info("Demande validée", { demande: demande });
      break;
    case DemandeStatutEnum["refusée"]:
      logger.info("Demande refusée", { demande: demande });
      break;
  }
};

export const [submitDemande, submitDemandeFactory] = inject(
  {
    createDemandeQuery,
    findOneDataEtablissement,
    findOneDataFormation,
    findOneDemande,
    findOneSimilarDemande,
  },
  (deps) =>
    async ({
      demande,
      user,
    }: {
      user: Pick<RequestUser, "id" | "role" | "codeRegion">;
      demande: Demande;
    }) => {
      const currentDemande = demande.numero
        ? await deps.findOneDemande(demande.numero)
        : undefined;

      const { cfd, uai } = demande;

      const dataEtablissement = await deps.findOneDataEtablissement({ uai });
      if (!dataEtablissement) throw Boom.badRequest("Code uai non valide");
      if (!dataEtablissement.codeRegion) throw Boom.badData();

      const scope = getPermissionScope(user.role, "intentions/ecriture");
      const isAllowed = guardScope(scope?.default, {
        user: () =>
          user.codeRegion === dataEtablissement.codeRegion &&
          (!currentDemande || user.id === currentDemande?.createurId),
        region: () => user.codeRegion === dataEtablissement.codeRegion,
        national: () => true,
      });
      if (!isAllowed) throw Boom.forbidden();

      const sameDemande = await deps.findOneSimilarDemande({
        ...demande,
        notNumero: demande.numero,
      });
      if (sameDemande) {
        logger.info("Demande similaire existante", { sameDemande, demande });
        throw Boom.badRequest("Demande similaire existante", {
          id: sameDemande.id,
          errors: {
            same_demande:
              "Une demande similaire existe avec ces mêmes champs: code diplôme, numéro établissement, dispositif et rentrée scolaire.",
          },
        });
      }

      const compensationRentreeScolaire =
        demande.typeDemande === "augmentation_compensation" ||
        demande.typeDemande === "ouverture_compensation"
          ? demande.rentreeScolaire
          : undefined;

      const dataFormation = await deps.findOneDataFormation({ cfd });
      if (!dataFormation) throw Boom.badRequest("Code diplome non valide");

      const demandeData = {
        ...currentDemande,
        libelleColoration: null,
        libelleFCIL: null,
        autreMotif: null,
        commentaire: null,
        compensationCfd: null,
        compensationCodeDispositif: null,
        compensationUai: null,
        capaciteScolaire: 0,
        capaciteScolaireActuelle: 0,
        capaciteScolaireColoree: 0,
        capaciteApprentissage: 0,
        capaciteApprentissageActuelle: 0,
        capaciteApprentissageColoree: 0,
        mixte: false,
        poursuitePedagogique: false,
        compensationRentreeScolaire,
        ...demande,
      };

      const errors = validateDemande(cleanNull(demandeData));
      if (errors) {
        logger.info("demande incorrecte", { errors, demande: demandeData });
        throw Boom.badData("Donnée incorrectes", { errors });
      }

      const created = await deps.createDemandeQuery({
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
