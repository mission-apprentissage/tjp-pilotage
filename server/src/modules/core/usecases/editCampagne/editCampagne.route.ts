import { createRoute } from "@http-wizard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { editCampagneSchema } from "./editCampagne.schema";
import { editCampagneUsecase } from "./editCampagne.usecase";

export const editCampagneRoute = (server: Server) => {
  return createRoute("/campagnes/:campagneId", {
    method: "PUT",
    schema: editCampagneSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("campagnes/ecriture"),
      handler: async (request, response) => {
        await editCampagneUsecase({
          campagneId: request.params.campagneId,
          campagne: request.body,
        });
        response.code(200).send();
      },
    });
  });
};
