import * as Boom from "@hapi/boom";
// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";
import { getPermissionScope, guardScope } from "shared";
import type { submitCorrectionSchema } from "shared/routes/schemas/post.correction.submit.schema";
import type { submitDemandeSchema } from "shared/routes/schemas/post.demande.submit.schema";
import { correctionValidators } from "shared/validators/correctionValidators";
import type { z } from "zod";

import type { RequestUser } from "@/modules/core/model/User";
import { findOneDemandeQuery } from "@/modules/demandes/repositories/findOneDemande.query";
import { getCurrentCampagne } from "@/modules/utils/getCurrentCampagne";
import logger from "@/services/logger";
import { cleanNull } from "@/utils/noNull";

import { createCorrectionQuery } from "./deps/createCorrection.query";
import { getCorrectionByIntentionNumeroQuery } from "./deps/getCorrectionByIntentionNumero.query";

type Correction = z.infer<typeof submitCorrectionSchema.body>["correction"];
type Demande = z.infer<typeof submitDemandeSchema.body>["demande"];

const validateCorrection = (correction: Correction, demande: Demande) => {
  let errors: Record<string, string> = {};
  for (const [key, validator] of Object.entries(correctionValidators)) {
    const error = validator(correction, demande);
    if (!error) continue;
    errors = { ...errors, [key]: error };
  }
  return Object.keys(errors).length ? errors : undefined;
};

export const [submitCorrectionUsecase, submitCorrectionFactory] = inject(
  {
    createCorrectionQuery,
    findOneDemandeQuery,
    getCurrentCampagne,
    getCorrectionByIntentionNumeroQuery,
  },
  (deps) =>
    async ({ correction, user }: { correction: Correction; user: RequestUser }) => {
      const [demande, campagne, correctionExistante] = await Promise.all([
        deps.findOneDemandeQuery(correction.intentionNumero),
        deps.getCurrentCampagne(user),
        deps.getCorrectionByIntentionNumeroQuery(correction.intentionNumero),
      ]);

      if (!campagne) {
        logger.error(
          {
            correction,
            user
          },
          "[SUBMIT_CORRECTION] Aucune campagne en cours dans laquelle importer la demande"
        );
        throw Boom.badData("Aucune campagne en cours dans laquelle importer la demande", {
          errors: {
            aucune_campagne_en_cours: "Aucune campagne en cours dans laquelle importer la demande.",
          },
        });
      }

      if (!demande) {
        logger.error(
          {
            correction,
            user
          },
          "[SUBMIT_CORRECTION] Aucune demande correspondant au numéro fourni"
        );
        throw Boom.badRequest("Aucune demande correspondant au numéro fourni", {
          errors: {
            numero: correction.intentionNumero,
            aucune_demande_correspondante: "Aucune demande correspondant au numéro fourni.",
          },
        });
      }

      if (correctionExistante) {
        logger.error(
          {
            correction,
            user
          },
          "[SUBMIT_CORRECTION] Une correction existe déjà pour cette demande"
        );
        throw Boom.forbidden("Une correction existe déjà pour cette demande", {
          errors: {
            correction_existante_correspondante: `Une correction existe déjà pour la demande ${correctionExistante.intentionNumero} (id: ${correctionExistante.id}).`,
          },
        });
      }

      const scope = getPermissionScope(user.role, "intentions/ecriture");
      const isAllowed = guardScope(scope, {
        région: () => user.codeRegion === demande.codeRegion,
        national: () => true,
      });

      if (!isAllowed) throw Boom.forbidden();

      const errors = validateCorrection(cleanNull(correction), cleanNull(demande) as Demande);
      if (errors) {
        logger.error(
          {
            errors,
            correction: correction,
            user
          },
          "[SUBMIT_CORRECTION] Correction incorrecte"
        );
        throw Boom.badData("Donnée incorrectes", { errors });
      }

      const result = await deps.createCorrectionQuery({
        correction: {
          ...correction,
          createdBy: user.id,
          updatedBy: user.id,
          campagneId: campagne.id,
        },
        user,
      });

      return result;
    }
);
