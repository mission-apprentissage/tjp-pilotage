import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { getDataForEtablissementMapSchema } from "./getDataForEtablissementMap.schema";
import { getDataForEtablissementMap } from "./getDataForEtablissementMap.usecase";

export const getDataForEtablissementMapRoute = (server: Server) => {
  return createRoute("/etablissement/:uai/map", {
    method: "GET",
    schema: getDataForEtablissementMapSchema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const stats = await getDataForEtablissementMap(
          { ...request.params },
          { ...request.query }
        );
        response.status(200).send({
          ...stats,
        });
      },
    });
  });
};
