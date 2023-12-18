import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { getFormationSchema } from "./getFormation.schema";
import { getFormations } from "./getFormations.usecase";

export const getFormationsRoute = ({ server }: { server: Server }) => {
  return createRoute("/formations", {
    method: "GET",
    schema: getFormationSchema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { order, orderBy, ...filters } = request.query;
        const formations = await getFormations({
          ...filters,
          orderBy: order && orderBy ? { order, column: orderBy } : undefined,
        });
        response.status(200).send(formations);
      },
    });
  });
};
