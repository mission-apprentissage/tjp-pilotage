import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../utils/hasPermission";
import { updateCampagne } from "./editCampagne.query";
import { editCampagneSchema } from "./editCampagne.schema";

export const editCampagneRoute = (server: Server) => {
  return createRoute("/campagnes/:campagneId", {
    method: "PUT",
    schema: editCampagneSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("campagnes/ecriture"),
      handler: async (request, response) => {
        await updateCampagne({
          campagneId: request.params.campagneId,
          data: request.body,
        });

        response.code(200).send();
      },
    });
  });
};
