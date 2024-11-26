import { createRoute } from "@http-wizard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { getCampagnes } from "./getCampagnes.query";
import { getCampagnesSchema } from "./getCampagnes.schema";

export const getCampagnesRoute = (server: Server) => {
  return createRoute("/campagnes", {
    method: "GET",
    schema: getCampagnesSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("campagnes/lecture"),
      handler: async (_request, response) => {
        const campagnes = await getCampagnes();
        response.status(200).send(campagnes);
      },
    });
  });
};
