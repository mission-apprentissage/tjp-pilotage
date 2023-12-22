import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { searchEtablissementSchema } from "./searchEtablissement.schema";
import { searchEtablissement } from "./searchEtablissement.usecase";

export const searchEtablissementRoute = (server: Server) => {
  return createRoute("/etablissement/search/:search", {
    method: "GET",
    schema: searchEtablissementSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions/lecture"),
      handler: async (request, response) => {
        const { search } = request.params;
        const { filtered } = request.query;
        const result = await searchEtablissement({
          search,
          filtered,
          user: request.user,
        });
        response.status(200).send(result);
      },
    });
  });
};
