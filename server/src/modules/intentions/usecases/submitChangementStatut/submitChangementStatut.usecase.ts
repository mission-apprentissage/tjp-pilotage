import Boom from "@hapi/boom";
// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";
import { getPermissionScope, guardScope } from "shared";
import type { z } from "zod";

import type { RequestUser } from "@/modules/core/model/User";
import { findOneIntention } from "@/modules/intentions/repositories/findOneIntention.query";
import { updateIntentionWithHistory } from "@/modules/intentions/repositories/updateIntentionWithHistory.query";

import { createChangementStatutQuery } from "./deps/createChangementStatut.query";
import { shootChangementStatutEmail } from "./deps/shootChangementStatutEmail.deps";
import type { submitChangementStatutSchema } from "./submitChangementStatut.schema";

type ChangementStatut = z.infer<typeof submitChangementStatutSchema.body>["changementStatut"];

export const [submitChangementStatutUsecase, submitChangementStatutFactory] = inject(
  {
    createChangementStatutQuery,
    updateIntentionWithHistory,
    findOneIntention,
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
      const scope = getPermissionScope(user.role, "intentions-perdir-statut/ecriture");

      const intentionData = await findOneIntention(changementStatut.intentionNumero);
      if (!intentionData) throw Boom.notFound("Intention non trouvée en base");

      const isAllowed = guardScope(scope?.default, {
        region: () => user.codeRegion === intentionData.codeRegion,
        national: () => true,
      });
      if (!isAllowed) throw Boom.forbidden();

      const newChangementStatut = {
        ...changementStatut,
        createdBy: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const newIntention = {
        ...intentionData,
        statut: changementStatut.statut,
        updatedAt: new Date(),
      };

      const createdIntention = await deps.updateIntentionWithHistory(newIntention);

      const createdChangementStatut = await deps.createChangementStatutQuery(newChangementStatut);

      await deps.shootChangementStatutEmail(
        newChangementStatut.statutPrecedent,
        newChangementStatut.statut,
        intentionData
      );

      return {
        ...createdIntention,
        statut: createdChangementStatut.statut,
        statutPrecedent: createdChangementStatut.statutPrecedent,
      };
    }
);
