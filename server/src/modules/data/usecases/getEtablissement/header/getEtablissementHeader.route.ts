import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../../server";
import { getEtablissementHeaderSchema } from "./getEtablissementHeader.schema";
import { getEtablissementHeader } from "./getEtablissementHeader.usecase";

export const getEtablissementHeaderRoute = ({ server }: { server: Server }) => {
  return createRoute("/etablissement/:uai/header", {
    method: "GET",
    schema: getEtablissementHeaderSchema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { uai } = request.params;
        const result = await getEtablissementHeader({ uai });
        response.status(200).send(result);
      },
    });
  });
};
