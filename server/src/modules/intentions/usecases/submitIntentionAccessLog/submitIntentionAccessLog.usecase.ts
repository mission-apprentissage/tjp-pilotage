import Boom from "@hapi/boom";
import { inject } from "injecti";
import { z } from "zod";

import { RequestUser } from "../../../core/model/User";
import { findOneIntention } from "../../repositories/findOneIntention.query";
import { updateIntentionWithHistory } from "../../repositories/updateIntentionWithHistory.query";
import { createIntentionAccessLog } from "./deps/createIntentionAccessLog.query";
import { submitIntentionAccessLogSchema } from "./submitIntentionAccessLog.schema";

type Intention = z.infer<
  typeof submitIntentionAccessLogSchema.body
>["intention"];

export const [
  submitIntentionAccessLogUsecase,
  submitIntentionAccessLogFactory,
] = inject(
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

      const createdAvis = await deps.createIntentionAccessLog(
        newIntentionAccessLog
      );

      return createdAvis;
    }
);
