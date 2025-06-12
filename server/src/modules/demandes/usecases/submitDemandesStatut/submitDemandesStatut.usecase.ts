import * as Boom from "@hapi/boom";
import { getPermissionScope, guardScope, isAdmin } from "shared";
import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";
import type { DemandeStatutType } from "shared/enum/demandeStatutEnum";
import { DemandeStatutEnum  } from "shared/enum/demandeStatutEnum";
import { PermissionEnum } from "shared/enum/permissionEnum";
import type { submitDemandesStatutSchema } from "shared/routes/schemas/post.demandes.statut.submit.schema";
import type { z } from "zod";

import type { RequestUser } from "@/modules/core/model/User";
import { findOneCampagneQuery } from "@/modules/demandes/repositories/findOneCampagne.query";
import { findOneDemandeQuery } from "@/modules/demandes/repositories/findOneDemande.query";
import logger from '@/services/logger';
import { inject } from "@/utils/inject";

import { updateChangementsStatutAndDemandesWithHistory } from './deps/updateChangementsStatutAndDemandesWithHistory.dep';

type Demandes = z.infer<typeof submitDemandesStatutSchema.body>["demandes"];
const NON_EDITABLE_STATUS: DemandeStatutType[] = [DemandeStatutEnum["demande validée"], DemandeStatutEnum["refusée"]];

export const [submitDemandesStatutUsecase, submitDemandesStatutFactory] = inject(
  {
    findOneDemandeQuery,
    findOneCampagneQuery,
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
        const campangeData = await deps.findOneCampagneQuery({ id: demandeData.campagneId});
        if (!campangeData) {
          logger.error(
            {
              statut,
              user
            },
            "[SUBMIT_DEMANDES_STATUT] Campagne non trouvée en base"
          );
          throw Boom.notFound("Campagne liée à la demande non trouvée en base");
        }

        const isAllowed = guardScope(scope, {
          région: () => user.codeRegion === demandeData.codeRegion,
          national: () => true,
        });

        const canEditDemandeInCampagne = campangeData.statut === CampagneStatutEnum["en cours"] || isAdmin({ user });
        const canEditDemande = demandeData.statut &&
          !NON_EDITABLE_STATUS.includes(demandeData.statut as DemandeStatutType);

        if (!isAllowed) {
          logger.error(
            {
              user,
              demande: demandeData.numero,
              scope
            },
            "[SUBMIT_DEMANDES_STATUT] Permission refusée pour modifier la demande"
          );
          throw Boom.forbidden("Vous n'avez pas la permission de modifier cette demande.");
        }

        if (!canEditDemandeInCampagne) {
          logger.error(
            {
              user,
              demande: demandeData.numero,
              campagne: campangeData.id,
              scope
            },
            "[SUBMIT_DEMANDES_STATUT] L'utilisateur n'a pas les droits nécessaires pour modifier le statut de la demande"
          );
          throw Boom.forbidden("Vous n'avez pas les droits nécessaires pour modifier une demande en dehors d'une campagne en cours.");
        }

        if (!canEditDemande) {
          logger.error(
            {
              user,
              demande: demandeData.numero,
              statut: demandeData.statut,
              campagne: campangeData.id,
              scope
            },
            "[SUBMIT_DEMANDES_STATUT] Impossible de modifier une demande avec ce statut"
          );
          throw Boom.forbidden(`Une demande avec le statut "${NON_EDITABLE_STATUS.join("\", \"")}" ne peut pas être modifiée. Veuillez effectuer une correction.`);
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
