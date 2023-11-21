import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { getDepartementSchema } from "./getDepartement.schema";
import { getDepartementsStats } from "./getDepartementsStats.query";

export const getDepartementRoute = ({ server }: { server: Server }) => {
  return createRoute("/departement/:codeDepartement", {
    method: "GET",
    schema: getDepartementSchema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const departementsStats = await getDepartementsStats({
          ...request.params,
          ...request.query,
        });
        if (!departementsStats) return response.status(404).send();
        response.status(200).send(departementsStats);
      },
    });
  });
};
