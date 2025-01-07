import Boom from "@hapi/boom";
// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";
import { getPermissionScope, guardScope, intentionValidators } from "shared";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import type { submitIntentionSchema } from "shared/routes/schemas/post.intention.submit.schema";
import type { z } from "zod";

import type { RequestUser } from "@/modules/core/model/User";
import { findOneDataEtablissement } from "@/modules/data/repositories/findOneDataEtablissement.query";
import { findOneDataFormation } from "@/modules/intentions/repositories/findOneDataFormation.query";
import { findOneIntention } from "@/modules/intentions/repositories/findOneIntention.query";
import { findOneSimilarIntention } from "@/modules/intentions/repositories/findOneSimilarIntention.query";
import { generateId, generateShortId } from "@/modules/utils/generateId";
import logger from "@/services/logger";
import { cleanNull } from "@/utils/noNull";

import { createChangementStatutQuery } from "./deps/createChangementStatut.query";
import { createIntentionQuery } from "./deps/createIntention.query";

type Intention = z.infer<typeof submitIntentionSchema.body>["intention"];

const validateIntention = (intention: Intention) => {
  let errors: Record<string, string> = {};
  for (const [key, validator] of Object.entries(intentionValidators)) {
    const error = validator(intention);
    if (!error) continue;
    errors = { ...errors, [key]: error };
  }
  return Object.keys(errors).length ? errors : undefined;
};

const logDemande = (intention?: { statut: string }) => {
  if (!intention) return;
  switch (intention.statut) {
  case DemandeStatutEnum["proposition"]:
    logger.info(
      {
        intention: intention,
      },
      "Proposition enregistrée"
    );
    break;
  case DemandeStatutEnum["demande validée"]:
    logger.info({ intention: intention }, "Demande validée");
    break;
  case DemandeStatutEnum["refusée"]:
    logger.info({ intention: intention }, "Demande refusée");
    break;
  }
};

export const [submitIntentionUsecase, submitIntentionFactory] = inject(
  {
    createIntentionQuery,
    createChangementStatutQuery,
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
      intention: Intention;
    }) => {
      const currentIntention = intention.numero ? await deps.findOneIntention(intention.numero) : undefined;

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

      const sameIntention = await deps.findOneSimilarIntention({
        ...intention,
        notNumero: intention.numero,
      });
      if (sameIntention) {
        logger.info(
          {
            sameIntention,
            intention,
          },
          "Demande similaire existante"
        );
        throw Boom.badRequest("Demande similaire existante", {
          id: sameIntention.id,
          errors: {
            same_demande:
              "Une demande similaire existe avec ces mêmes champs: code diplôme, numéro établissement, dispositif et rentrée scolaire.",
          },
        });
      }

      const dataFormation = await deps.findOneDataFormation({ cfd });
      if (!dataFormation) throw Boom.badRequest("Code diplome non valide");

      const intentionData = {
        ...currentIntention,
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
        ...intention,
      };

      const errors = validateIntention(cleanNull(intentionData));
      if (errors) {
        logger.info(
          {
            errors,
            intention: intentionData,
          },
          "Intention incorrecte"
        );
        throw Boom.badData("Donnée incorrectes", { errors });
      }

      const created = await deps.createIntentionQuery({
        ...intentionData,
        id: currentIntention?.id ?? generateId(),
        numero: currentIntention?.numero ?? generateShortId(),
        createdBy: currentIntention?.createdBy ?? user.id,
        updatedBy: user.id,
        codeAcademie: dataEtablissement.codeAcademie,
        codeRegion: dataEtablissement.codeRegion,
        updatedAt: new Date(),
      });

      if (created.statut !== currentIntention?.statut) {
        deps.createChangementStatutQuery({
          id: generateId(),
          intentionNumero: created.numero,
          statutPrecedent: currentIntention?.statut,
          statut: created.statut,
          createdBy: user.id,
          updatedAt: new Date(),
        });
      }

      logDemande(created);
      return created;
    }
);
