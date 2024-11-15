import Boom from "@hapi/boom";
import { inject } from "injecti";

import { RequestUser } from "../../../core/model/User";
import { findOneIntention } from "../../repositories/findOneIntention.query";
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
      if (!intentionData) throw Boom.notFound("Intention non trouvée en base");

      const createdSuivi = await deps.createSuiviQuery({
        intentionNumero,
        userId: user.id,
      });

      return createdSuivi;
    }
);
