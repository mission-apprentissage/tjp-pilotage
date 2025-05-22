import * as Boom from "@hapi/boom";
import { getPermissionScope, guardScope } from "shared";
import type { DemandeStatutType } from "shared/enum/demandeStatutEnum";
import { PermissionEnum } from "shared/enum/permissionEnum";
import type { submitDemandesStatutSchema } from "shared/routes/schemas/post.demandes.statut.submit.schema";
import type { z } from "zod";

import type { RequestUser } from "@/modules/core/model/User";
import { findOneDemandeQuery } from "@/modules/demandes/repositories/findOneDemande.query";
import logger from '@/services/logger';
import { inject } from "@/utils/inject";

import { updateChangementsStatutAndDemandesWithHistory } from './deps/updateChangementsStatutAndDemandesWithHistory.dep';

type Demandes = z.infer<typeof submitDemandesStatutSchema.body>["demandes"];

export const [submitDemandesStatutUsecase, submitDemandesStatutFactory] = inject(
  {
    findOneDemandeQuery,
    updateChangementsStatutAndDemandesWithHistory
  },
  (deps) =>
    async ({
      user,
      demandes,
      statut
    }: {
      user: Pick<RequestUser, "id" | "role" | "codeRegion" | "uais">;
      demandes: Demandes;
      statut: DemandeStatutType;
    }) => {
      const scope = getPermissionScope(user.role, PermissionEnum["demande-statut/ecriture"]);

      const demandesData = await Promise.all(demandes.map(async (demande: Demandes[number]) => {
        const demandeData = await deps.findOneDemandeQuery(demande.numero);
        if (!demandeData) {
          logger.error(
            {
              statut,
              user
            },
            "[SUBMIT_DEMANDES_STATUT] Demande non trouvée en base"
          );
          throw Boom.notFound("Demande non trouvée en base");
        }

        const isAllowed = guardScope(scope, {
          région: () => user.codeRegion === demandeData.codeRegion,
          national: () => true,
        });
        if (!isAllowed) {
          throw Boom.forbidden();
        }
        return demandeData;
      }));

      const newChangementStatut = demandesData
        .map((demandeData) => ({
          demandeNumero: demandeData.numero,
          statutPrecedent: demandeData.statut,
          statut,
          createdBy: user.id,
          updatedAt: new Date(),
        }));

      const newDemandes = demandesData
        .map((demandeData) => ({
          ...demandeData,
          statut,
        }));

      const changementsStatut = await deps.updateChangementsStatutAndDemandesWithHistory({
        demandes: newDemandes,
        changementsStatut: newChangementStatut
      });

      return { changementsStatut };
    }
);
