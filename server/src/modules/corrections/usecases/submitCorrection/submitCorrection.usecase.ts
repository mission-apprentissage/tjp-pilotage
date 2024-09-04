import Boom from "@hapi/boom";
import { inject } from "injecti";
import { getPermissionScope, guardScope } from "shared";
import { z } from "zod";

import { RequestUser } from "../../../core/model/User";
import { getCurrentCampagneQuery } from "../../../demandes/queries/getCurrentCampagne/getCurrentCampagne.query";
import { findOneDemande } from "../../../demandes/repositories/findOneDemande.query";
import { createCorrectionQuery } from "./deps/createCorrection.query";
import { getCorrectionByIntentionNumeroQuery } from "./deps/getCorrectionByIntentionNumero.query";
import { submitCorrectionSchema } from "./submitCorrection.schema";

type Correction = z.infer<typeof submitCorrectionSchema.body>["correction"];

export const [submitCorrectionUsecase, submitCorrectionFactory] = inject(
  {
    createCorrectionQuery,
    findOneDemande,
    getCurrentCampagneQuery,
    getCorrectionByIntentionNumeroQuery,
  },
  (deps) =>
    async ({
      correction,
      user,
    }: {
      correction: Correction;
      user: Pick<RequestUser, "id" | "codeRegion" | "role">;
    }) => {
      const [demande, campagne, correctionExistante] = await Promise.all([
        deps.findOneDemande(correction.intentionNumero),
        deps.getCurrentCampagneQuery(),
        deps.getCorrectionByIntentionNumeroQuery(correction.intentionNumero),
      ]);

      if (!campagne) {
        throw Boom.badData(
          "Aucune campagne en cours dans laquelle importer la demande",
          {
            errors: {
              aucune_campagne_en_cours:
                "Aucune campagne en cours dans laquelle importer la demande.",
            },
          }
        );
      }

      if (!demande) {
        throw Boom.badRequest("Aucune demande correspondant au numéro fourni", {
          errors: {
            numero: correction.intentionNumero,
            aucune_demande_correspondante:
              "Aucune demande correspondant au numéro fourni.",
          },
        });
      }

      if (correctionExistante) {
        throw Boom.forbidden("Une correction existe déjà pour cette demande", {
          errors: {
            correction_existante_correspondante: `Une correction existe déjà pour la demande ${correctionExistante.intentionNumero} (id: ${correctionExistante.id}).`,
          },
        });
      }

      const scope = getPermissionScope(user.role, "intentions/ecriture");
      const isAllowed = guardScope(scope?.default, {
        region: () => user.codeRegion === demande.codeRegion,
        national: () => true,
      });

      if (!isAllowed) throw Boom.forbidden();

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
