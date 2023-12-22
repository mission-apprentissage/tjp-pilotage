import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { getEtablissementSchema } from "./getEtablissement.schema";
import { getEtablissement } from "./getEtablissement.usecase";

export const getEtablissementRoute = (server: Server) => {
  return createRoute("/etablissement/:uai", {
    method: "GET",
    schema: getEtablissementSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions/lecture"),
      handler: async (request, response) => {
        const { uai } = request.params;
        const result = await getEtablissement({ uai });
        response.status(200).send(result);
      },
    });
  });
};
