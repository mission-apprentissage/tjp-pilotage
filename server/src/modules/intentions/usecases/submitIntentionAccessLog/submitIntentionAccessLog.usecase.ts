import Boom from "@hapi/boom";
// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";
import type { submitIntentionAccessLogSchema } from "shared/routes/schemas/post.demande.access.submit.schema";
import type { z } from "zod";

import type { RequestUser } from "@/modules/core/model/User";
import { findOneIntention } from "@/modules/intentions/repositories/findOneIntention.query";
import { updateIntentionWithHistory } from "@/modules/intentions/repositories/updateIntentionWithHistory.query";

import { createIntentionAccessLog } from "./deps/createIntentionAccessLog.query";

type Intention = z.infer<typeof submitIntentionAccessLogSchema.body>["intention"];

export const [submitIntentionAccessLogUsecase, submitIntentionAccessLogFactory] = inject(
  {
    createIntentionAccessLog,
    updateIntentionWithHistory,
    findOneIntention,
  },
  (deps) =>
    async ({
      user,
      intention,
    }: {
      user: Pick<RequestUser, "id" | "role" | "codeRegion" | "uais">;
      intention: Intention;
    }) => {
      const intentionData = await findOneIntention(intention.numero);
      if (!intentionData) throw Boom.notFound("Intention non trouvée en base");

      const newIntentionAccessLog = {
        intentionNumero: intentionData.numero,
        userId: user.id,
      };

      const createdAvis = await deps.createIntentionAccessLog(newIntentionAccessLog);

      return createdAvis;
    }
);
