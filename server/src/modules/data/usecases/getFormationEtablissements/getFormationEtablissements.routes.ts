import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { getFormationEtablissementsSchema } from "./getFormationEtablissements.schema";
import { getFormationEtablissements } from "./getFormationEtablissements.usecase";

export const getFormationEtablissementsRoutes = ({
  server,
}: {
  server: Server;
}) => {
  return createRoute("/etablissements", {
    method: "GET",
    schema: getFormationEtablissementsSchema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { order, orderBy, ...filters } = request.query;
        const etablissements = await getFormationEtablissements({
          ...filters,
          orderBy: order && orderBy ? { order, column: orderBy } : undefined,
        });
        response.status(200).send(etablissements);
      },
    });
  });
};
