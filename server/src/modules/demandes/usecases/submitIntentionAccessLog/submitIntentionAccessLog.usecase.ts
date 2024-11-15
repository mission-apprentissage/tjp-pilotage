import Boom from "@hapi/boom";
import { inject } from "injecti";
import { z } from "zod";

import { RequestUser } from "../../../core/model/User";
import { findOneDemande } from "../../repositories/findOneDemande.query";
import { updateDemandeWithHistory } from "../../repositories/updateDemandeWithHistory.query";
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
    updateDemandeWithHistory,
    findOneDemande,
  },
  (deps) =>
    async ({
      user,
      intention,
    }: {
      user: Pick<RequestUser, "id" | "role" | "codeRegion" | "uais">;
      intention: Intention;
    }) => {
      const demandeData = await findOneDemande(intention.numero);
      if (!demandeData) throw Boom.notFound("Demande non trouvée en base");

      const newIntentionAccessLog = {
        intentionNumero: demandeData.numero,
        userId: user.id,
      };

      const createdAvis = await deps.createIntentionAccessLog(
        newIntentionAccessLog
      );

      return createdAvis;
    }
);
