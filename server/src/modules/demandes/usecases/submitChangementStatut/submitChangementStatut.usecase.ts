import * as Boom from "@hapi/boom";
import { getPermissionScope, guardScope } from "shared";
import { PermissionEnum } from "shared/enum/permissionEnum";
import type { submitChangementStatutSchema } from "shared/routes/schemas/post.demande.statut.submit.schema";
import type { z } from "zod";

import type { RequestUser } from "@/modules/core/model/User";
import { findOneDemandeQuery } from "@/modules/demandes/repositories/findOneDemande.query";
import { updateDemandeWithHistory } from "@/modules/demandes/repositories/updateDemandeWithHistory.query";
import logger from "@/services/logger";
// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "@/utils/inject";

import { createChangementStatutQuery } from "./deps/createChangementStatut.dep";
import { shootChangementStatutEmail } from "./deps/shootChangementStatutEmail.dep";

type ChangementStatut = z.infer<typeof submitChangementStatutSchema.body>["changementStatut"];

export const [submitChangementStatutUsecase, submitChangementStatutFactory] = inject(
  {
    createChangementStatutQuery,
    updateDemandeWithHistory,
    findOneDemandeQuery,
    shootChangementStatutEmail,
  },
  (deps) =>
    async ({
      user,
      changementStatut,
    }: {
      user: Pick<RequestUser, "id" | "role" | "codeRegion" | "uais">;
      changementStatut: ChangementStatut;
    }) => {
      const scope = getPermissionScope(user.role, PermissionEnum["demande-statut/ecriture"]);

      const demandeData = await findOneDemandeQuery(changementStatut.demandeNumero);
      if (!demandeData) {
        logger.error(
          {
            changementStatut,
            user
          },
          "[SUBMIT_CHANGEMENT_STATUT] Demande non trouvée en base"
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

      const newChangementStatut = {
        ...changementStatut,
        createdBy: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const newDemande = {
        ...demandeData,
        statut: changementStatut.statut,
        updatedAt: new Date(),
      };

      const createdDemande = await deps.updateDemandeWithHistory(newDemande);

      const createdChangementStatut = await deps.createChangementStatutQuery(newChangementStatut);

      await deps.shootChangementStatutEmail(
        newChangementStatut.statutPrecedent,
        newChangementStatut.statut,
        demandeData
      );

      return {
        ...createdDemande,
        statut: createdChangementStatut.statut,
        statutPrecedent: createdChangementStatut.statutPrecedent,
      };
    }
);
