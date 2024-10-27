// @ts-nocheck -- TODO

import { createRoute } from "@http-wizard/core";
import { getPermissionScope, guardScope } from "shared";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { getIntentionSchema } from "./getIntention.schema";
import { getIntentionUsecase } from "./getIntention.usecase";

export const getIntentionRoute = (server: Server) => {
  return createRoute("/intention/:numero", {
    method: "GET",
    schema: getIntentionSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions-perdir/lecture"),
      handler: async (request, response) => {
        const user = request.user!;
        const intention = await getIntentionUsecase({
          numero: request.params.numero,
          user,
        });

        const scope = getPermissionScope(user.role, "intentions-perdir/ecriture");
        const canEdit = guardScope(scope?.default, {
          uai: () => user.uais?.includes(intention.uai) ?? false,
          region: () => user.codeRegion === intention.codeRegion,
          national: () => true,
        });
        response.status(200).send({
          ...intention,
          statut: intention.statut,
          canEdit,
        });
      },
    });
  });
};
