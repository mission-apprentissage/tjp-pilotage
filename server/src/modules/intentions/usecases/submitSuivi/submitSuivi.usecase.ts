import Boom from "@hapi/boom";
import { inject } from "injecti";

import { RequestUser } from "../../../core/model/User";
import { findOneIntention } from "../../repositories/findOneIntention.query";
import { updateIntentionWithHistory } from "../../repositories/updateIntentionWithHistory.query";
import { createSuiviQuery } from "./submitSuivi.query";

export const [submitSuiviUsecase, submitSuiviFactory] = inject(
  {
    createSuiviQuery,
    updateIntentionWithHistory,
    findOneIntention,
  },
  (deps) =>
    async ({
      user,
      intentionNumero,
    }: {
      user: Pick<RequestUser, "id" | "role" | "codeRegion" | "uais">;
      intentionNumero: string;
    }) => {
      const intentionData = await findOneIntention(intentionNumero);
      if (!intentionData) throw Boom.notFound("Intention not found");

      const createdSuivi = await deps.createSuiviQuery({
        intentionNumero,
        userId: user.id,
      });

      return createdSuivi;
    }
);
