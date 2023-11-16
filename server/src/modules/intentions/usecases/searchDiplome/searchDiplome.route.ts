import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { searchDiplomeSchema } from "./searchDiplome.schema";
import { searchDiplome } from "./searchDiplome.usecase";

export const searchDiplomeRoute = (server: Server) => {
  return createRoute("/diplome/search/:search", {
    method: "GET",
    schema: searchDiplomeSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions/lecture"),
      handler: async (request, response) => {
        const { search } = request.params;
        const result = await searchDiplome({ search });
        response.status(200).send(result);
      },
    });
  });
};
