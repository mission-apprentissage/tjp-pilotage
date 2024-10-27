import Boom from "@hapi/boom";
// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";

import type { RequestUser } from "@/modules/core/model/User";
import { findOneIntention } from "@/modules/intentions/repositories/findOneIntention.query";

import { createSuiviQuery } from "./submitSuivi.query";

export const [submitSuiviUsecase, submitSuiviFactory] = inject(
  {
    createSuiviQuery,
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
