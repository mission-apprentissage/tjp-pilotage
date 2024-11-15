import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { getFormationEtablissementsSchema } from "./getFormationEtablissements.schema";
import { getFormationEtablissements } from "./getFormationEtablissements.usecase";

export const getFormationEtablissementsRoutes = (server: Server) => {
  return createRoute("/etablissements", {
    method: "GET",
    schema: getFormationEtablissementsSchema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { ...filters } = request.query;
        const etablissements = await getFormationEtablissements({
          ...filters,
        });
        response.status(200).send(etablissements);
      },
    });
  });
};
