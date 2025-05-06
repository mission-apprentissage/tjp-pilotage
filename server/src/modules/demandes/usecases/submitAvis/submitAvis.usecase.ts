import * as Boom from "@hapi/boom";
import { getPermissionScope, guardScope } from "shared";
import {PermissionEnum} from 'shared/enum/permissionEnum';
import type { submitAvisSchema } from "shared/routes/schemas/post.demande.avis.submit.schema";
import type { z } from "zod";

import type { RequestUser } from "@/modules/core/model/User";
import { findOneDemandeQuery } from "@/modules/demandes/repositories/findOneDemande.query";
import { updateDemandeWithHistory } from "@/modules/demandes/repositories/updateDemandeWithHistory.query";
// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "@/utils/inject";

import { createAvisQuery } from "./deps/createAvis.query";

type Avis = z.infer<typeof submitAvisSchema.body>["avis"];

export const [submitAvisUsecase, submitAvisFactory] = inject(
  {
    createAvisQuery,
    updateDemandeWithHistory,
    findOneDemandeQuery,
  },
  (deps) =>
    async ({ user, avis }: { user: Pick<RequestUser, "id" | "role" | "codeRegion" | "uais">; avis: Avis }) => {
      const scope = getPermissionScope(user.role, PermissionEnum["demande-avis/ecriture"]);

      const demandeData = await findOneDemandeQuery(avis.demandeNumero);
      if (!demandeData) throw Boom.notFound("Demande non trouvée en base");

      const isAllowed = guardScope(scope, {
        région: () => user.codeRegion === demandeData.codeRegion,
        national: () => true,
      });
      if (!isAllowed) throw Boom.forbidden();

      const newDemande = {
        ...demandeData,
        updatedAt: new Date(),
      };

      const newAvis = {
        ...avis,
        createdBy: avis.createdBy ?? user.id,
        updatedBy: user.id,
        createdAt: avis.createdAt ?? new Date(),
        updatedAt: new Date(),
      };

      const createdAvis = await deps.createAvisQuery(newAvis).then((avis) => {
        deps.updateDemandeWithHistory(newDemande);
        return avis;
      });

      return createdAvis;
    }
);
