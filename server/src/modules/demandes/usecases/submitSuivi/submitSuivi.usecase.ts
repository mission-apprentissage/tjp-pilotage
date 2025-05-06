import * as Boom from "@hapi/boom";

import type { RequestUser } from "@/modules/core/model/User";
import { findOneDemandeQuery } from "@/modules/demandes/repositories/findOneDemande.query";
// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "@/utils/inject";

import { createSuiviQuery } from "./submitSuivi.query";

export const [submitSuiviUsecase, submitSuiviFactory] = inject(
  {
    createSuiviQuery,
    findOneDemandeQuery,
  },
  (deps) =>
    async ({
      user,
      demandeNumero,
    }: {
      user: Pick<RequestUser, "id" | "role" | "codeRegion" | "uais">;
      demandeNumero: string;
    }) => {
      const demandeData = await findOneDemandeQuery(demandeNumero);
      if (!demandeData) throw Boom.notFound("Demande non trouvée en base");

      const createdSuivi = await deps.createSuiviQuery({
        demandeNumero,
        userId: user.id,
      });

      return createdSuivi;
    }
);
