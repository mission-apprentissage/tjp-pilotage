import { createRoute } from "@http-wizard/core";

import type { Server } from "@/server/server";

import { getEtablissementSchema } from "./getEtablissement.schema";
import { getEtablissement } from "./getEtablissement.usecase";

export const getEtablissementRoute = ({ server }: { server: Server }) => {
  return createRoute("/etablissement/:uai", {
    method: "GET",
    schema: getEtablissementSchema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { uai } = request.params;
        const result = await getEtablissement({ uai });
        response.status(200).send(result);
      },
    });
  });
};
