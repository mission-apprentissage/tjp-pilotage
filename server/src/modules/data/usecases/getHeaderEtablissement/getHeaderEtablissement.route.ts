import { createRoute } from "@http-wizard/core";

import type { Server } from "@/server/server";

import { getHeaderEtablissementSchema } from "./getHeaderEtablissement.schema";
import { getHeaderEtablissement } from "./getHeaderEtablissement.usecase";

export const getHeaderEtablissementRoute = ({ server }: { server: Server }) => {
  return createRoute("/etablissement/:uai/header", {
    method: "GET",
    schema: getHeaderEtablissementSchema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { uai } = request.params;
        const result = await getHeaderEtablissement({ uai });
        response.status(200).send(result);
      },
    });
  });
};
