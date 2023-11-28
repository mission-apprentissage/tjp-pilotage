import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { getEtablissementsSchema } from "./getEtablissements.schema";
import { getEtablissements } from "./getEtablissements.usecase";

export const getEtablissementsRoutes = ({ server }: { server: Server }) => {
  return createRoute("/etablissements", {
    method: "GET",
    schema: getEtablissementsSchema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { order, orderBy, ...rest } = request.query;
        const etablissements = await getEtablissements({
          ...rest,
          orderBy: order && orderBy ? { order, column: orderBy } : undefined,
        });
        etablissements.etablissements[0].continuumEtablissement;
        response.status(200).send(etablissements);
      },
    });
  });
};
