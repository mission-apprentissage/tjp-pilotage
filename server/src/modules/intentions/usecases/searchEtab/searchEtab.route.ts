import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { searchEtabSchema } from "./searchEtab.schema";
import { searchEtab } from "./searchEtab.usecase";

export const searchEtabRoute = (server: Server) => {
  return createRoute("/etab/search/:search", {
    method: "GET",
    schema: searchEtabSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions/lecture"),
      handler: async (request, response) => {
        const { search } = request.params;
        const result = await searchEtab({ search, user: request.user });
        response.status(200).send(result);
      },
    });
  });
};
