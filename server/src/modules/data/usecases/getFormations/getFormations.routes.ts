import { createRoute } from "@http-wizard/core";

import type { Server } from "@/server/server";

import { getFormationSchema } from "./getFormations.schema";
import { getFormations } from "./getFormations.usecase";

export const getFormationsRoute = ({ server }: { server: Server }) => {
  return createRoute("/formations", {
    method: "GET",
    schema: getFormationSchema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { ...filters } = request.query;
        const formations = await getFormations({
          ...filters,
        });
        response.status(200).send(formations);
      },
    });
  });
};
