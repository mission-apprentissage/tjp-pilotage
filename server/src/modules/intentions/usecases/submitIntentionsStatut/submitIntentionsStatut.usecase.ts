import * as Boom from "@hapi/boom";
// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";
import { getPermissionScope, guardScope } from "shared";
import type { DemandeStatutType } from "shared/enum/demandeStatutEnum";
import type { submitIntentionsStatutSchema } from "shared/routes/schemas/post.intentions.statut.submit.schema";
import type { z } from "zod";

import type { RequestUser } from "@/modules/core/model/User";
import { findOneIntention } from "@/modules/intentions/repositories/findOneIntention.query";
import logger from '@/services/logger';

import { updateChangementsStatutAndDemandesIntentionsWithHistory } from './deps/updateChangementsStatutAndDemandesIntentionsWithHistory.dep';

type Intentions = z.infer<typeof submitIntentionsStatutSchema.body>["intentions"];

export const [submitIntentionsStatutUsecase, submitIntentionsStatutFactory] = inject(
  {
    findOneIntention,
    updateChangementsStatutAndDemandesIntentionsWithHistory
  },
  (deps) =>
    async ({
      user,
      intentions,
      statut
    }: {
      user: Pick<RequestUser, "id" | "role" | "codeRegion" | "uais">;
      intentions: Intentions;
      statut: DemandeStatutType;
    }) => {
      const scope = getPermissionScope(user.role, "intentions-perdir-statut/ecriture");

      const intentionsData = await Promise.all(intentions.map(async (intention: Intentions[number]) => {
        const intentionData = await deps.findOneIntention(intention.numero);
        if (!intentionData) {
          logger.error(
            {
              statut,
              user
            },
            "[SUBMIT_INTENTIONS_STATUT] Intention non trouvée en base"
          );
          throw Boom.notFound("Intention non trouvée en base");
        }

        const isAllowed = guardScope(scope, {
          région: () => user.codeRegion === intentionData.codeRegion,
          national: () => true,
        });
        if (!isAllowed) {
          throw Boom.forbidden();
        }
        return intentionData;
      }));

      const newChangementStatut = intentionsData
        .filter((intention) => intention.isIntention)
        .map((intentionData) => ({
          intentionNumero: intentionData.numero,
          statutPrecedent: intentionData.statut,
          statut,
          createdBy: user.id,
          updatedAt: new Date(),
        }));

      const newIntentions = intentionsData
        .filter((intention) => intention.isIntention)
        .map((intentionData) => ({
          ...intentionData,
          statut,
        }));

      const newDemandes = intentionsData
        .filter((intention) => !intention.isIntention)
        .map((intentionData) => ({
          ...intentionData,
          statut,
        }));

      const changementsStatut = await deps.updateChangementsStatutAndDemandesIntentionsWithHistory({
        demandes: newDemandes,
        intentions: newIntentions,
        changementsStatut: newChangementStatut
      });

      return { changementsStatut };
    }
);
