import Boom from "@hapi/boom";
import { inject } from "injecti";
import { getPermissionScope, guardScope } from "shared";
import { z } from "zod";

import { RequestUser } from "../../../core/model/User";
import { findOneIntention } from "../../repositories/findOneIntention.query";
import { updateIntentionWithHistory } from "../../repositories/updateIntentionWithHistory.query";
import { createAvisQuery } from "./deps/createAvis.query";
import { submitAvisSchema } from "./submitAvis.schema";

type Avis = z.infer<typeof submitAvisSchema.body>["avis"];

export const [submitAvisUsecase, submitAvisFactory] = inject(
  {
    createAvisQuery,
    updateIntentionWithHistory,
    findOneIntention,
  },
  (deps) =>
    async ({
      user,
      avis,
    }: {
      user: Pick<RequestUser, "id" | "role" | "codeRegion" | "uais">;
      avis: Avis;
    }) => {
      const scope = getPermissionScope(
        user.role,
        "intentions-perdir-avis/ecriture"
      );

      const intentionData = await findOneIntention(avis.intentionNumero);
      if (!intentionData) throw Boom.notFound("Intention not found");

      const isAllowed = guardScope(scope?.default, {
        region: () => user.codeRegion === intentionData.codeRegion,
        national: () => true,
      });
      if (!isAllowed) throw Boom.forbidden();

      const newAvis = {
        ...avis,
        createdBy: avis.createdBy ?? user.id,
        updatedBy: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const createdAvis = await deps.createAvisQuery(newAvis);

      return createdAvis;
    }
);
