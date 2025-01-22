import Boom from "@hapi/boom";
// eslint-disable-next-line n/no-extraneous-import, import/no-extraneous-dependencies
import { inject } from "injecti";

import type { RequestUser } from "@/modules/core/model/User";
import {findOneDemandeQuery} from '@/modules/demandes/repositories/findOneDemande.query';

import { createSuiviQuery } from "./submitSuivi.query";

export const [submitSuiviUsecase, submitSuiviFactory] = inject(
  {
    createSuiviQuery,
    findOneDemandeQuery,
  },
  (deps) =>
    async ({
      user,
      intentionNumero,
    }: {
      user: Pick<RequestUser, "id" | "role" | "codeRegion" | "uais">;
      intentionNumero: string;
    }) => {
      const intentionData = await findOneDemandeQuery(intentionNumero);
      if (!intentionData) throw Boom.notFound("Intention non trouvée en base");

      const createdSuivi = await deps.createSuiviQuery({
        intentionNumero,
        userId: user.id,
      });

      return createdSuivi;
    }
);
