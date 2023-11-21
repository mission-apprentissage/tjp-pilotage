import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
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
        const { order, orderBy, ...filters } = request.query;
        const etablissement = await getEtablissement({
          ...filters,
          orderBy: order && orderBy ? { order, column: orderBy } : undefined,
        });
        if (!etablissement) return response.status(404).send();
        response.status(200).send(etablissement);
      },
    });
  });
};
