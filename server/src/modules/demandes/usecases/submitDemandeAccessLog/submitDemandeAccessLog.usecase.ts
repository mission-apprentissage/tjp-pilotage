import * as Boom from "@hapi/boom";
// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";
import type { submitDemandeAccessLogSchema } from "shared/routes/schemas/post.demande.access.submit.schema";
import type { z } from "zod";

import type { RequestUser } from "@/modules/core/model/User";
import { findOneDemandeQuery } from "@/modules/demandes/repositories/findOneDemande.query";
import { updateDemandeWithHistory } from "@/modules/demandes/repositories/updateDemandeWithHistory.query";

import { createDemandeAccessLog } from "./deps/createDemandeAccessLog.dep";

type Demande = z.infer<typeof submitDemandeAccessLogSchema.body>["demande"];

export const [submitDemandeAccessLogUsecase, submitDemandeAccessLogFactory] = inject(
  {
    createDemandeAccessLog,
    updateDemandeWithHistory,
    findOneDemandeQuery,
  },
  (deps) =>
    async ({
      user,
      demande,
    }: {
      user: Pick<RequestUser, "id" | "role" | "codeRegion" | "uais">;
      demande: Demande;
    }) => {
      const demandeData = await findOneDemandeQuery(demande.numero);
      if (!demandeData) throw Boom.notFound("Demande non trouvée en base");

      const newDemandeAccessLog = {
        demandeNumero: demandeData.numero,
        userId: user.id,
      };

      const createdAvis = await deps.createDemandeAccessLog(newDemandeAccessLog);

      return createdAvis;
    }
);
