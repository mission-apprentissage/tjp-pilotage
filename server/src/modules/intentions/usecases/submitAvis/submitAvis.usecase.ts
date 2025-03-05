import * as Boom from "@hapi/boom";
// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";
import { getPermissionScope, guardScope } from "shared";
import {PermissionEnum} from 'shared/enum/permissionEnum';
import type { submitAvisSchema } from "shared/routes/schemas/post.intention.avis.submit.schema";
import type { z } from "zod";

import type { RequestUser } from "@/modules/core/model/User";
import { findOneIntention } from "@/modules/intentions/repositories/findOneIntention.query";
import { updateIntentionWithHistory } from "@/modules/intentions/repositories/updateIntentionWithHistory.query";

import { createAvisQuery } from "./deps/createAvis.query";

type Avis = z.infer<typeof submitAvisSchema.body>["avis"];

export const [submitAvisUsecase, submitAvisFactory] = inject(
  {
    createAvisQuery,
    updateIntentionWithHistory,
    findOneIntention,
  },
  (deps) =>
    async ({ user, avis }: { user: Pick<RequestUser, "id" | "role" | "codeRegion" | "uais">; avis: Avis }) => {
      const scope = getPermissionScope(user.role, PermissionEnum["intentions-perdir-avis/ecriture"]);

      const intentionData = await findOneIntention(avis.intentionNumero);
      if (!intentionData) throw Boom.notFound("Intention non trouvée en base");

      const isAllowed = guardScope(scope, {
        région: () => user.codeRegion === intentionData.codeRegion,
        national: () => true,
      });
      if (!isAllowed) throw Boom.forbidden();

      const newIntention = {
        ...intentionData,
        updatedAt: new Date(),
      };

      const newAvis = {
        ...avis,
        createdBy: avis.createdBy ?? user.id,
        updatedBy: user.id,
        createdAt: avis.createdAt ?? new Date(),
        updatedAt: new Date(),
      };

      const createdAvis = await deps.createAvisQuery(newAvis).then((avis) => {
        deps.updateIntentionWithHistory(newIntention);
        return avis;
      });

      return createdAvis;
    }
);
