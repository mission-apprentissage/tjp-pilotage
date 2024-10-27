import { createRoute } from "@http-wizard/core";

import type { Server } from "@/server/server";

import { getDepartements } from "./getDepartements.query";
import { getDepartementsSchema } from "./getDepartements.schema";

export const getDepartementsRoute = ({ server }: { server: Server }) => {
  return createRoute("/departements", {
    method: "GET",
    schema: getDepartementsSchema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (_, response) => {
        const departements = await getDepartements();
        response.status(200).send(departements);
      },
    });
  });
};
