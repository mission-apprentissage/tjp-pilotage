import { createRoute } from "@http-wizard/core";
import { whoAmISchema } from "shared/routes/schemas/get.auth.whoAmI.schema";

import type { Server } from "@/server/server";

export const whoAmIRoute = (server: Server) => {
  return createRoute("/auth/whoAmI", {
    method: "GET",
    schema: whoAmISchema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const user = request.user;
        response.status(200).send(user && { user });
      },
    });
  });
};
