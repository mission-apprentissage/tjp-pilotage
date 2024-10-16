import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../utils/hasPermission";
import { createCampagneSchema } from "./createCampagne.schema";
import { createCampagne } from "./createCampagne.usecase";

export const createCampagneRoute = (server: Server) => {
  return createRoute("/campagnes/:campagneId", {
    method: "POST",
    schema: createCampagneSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("campagnes/ecriture"),
      handler: async (request, response) => {
        await createCampagne(request.body);

        response.code(200).send();
      },
    });
  });
};
