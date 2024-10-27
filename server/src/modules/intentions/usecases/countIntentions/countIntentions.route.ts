import { createRoute } from "@http-wizard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { countIntentionsSchema } from "./countIntentions.schema";
import { countIntentionsUsecase } from "./countIntentions.usecase";

export const countIntentionsRoute = (server: Server) => {
  return createRoute("/intentions/count", {
    method: "GET",
    schema: countIntentionsSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions-perdir/lecture"),
      handler: async (request, response) => {
        const { user, query: filters } = request;
        const result = await countIntentionsUsecase({
          user: user!,
          ...filters,
        });
        response.status(200).send(result);
      },
    });
  });
};
