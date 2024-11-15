import { createRoute } from "@http-wizard/core";
import { z } from "zod";

import { Server } from "../../../../server";

export const homeRoute = (server: Server) => {
  return createRoute("/", {
    method: "GET",
    schema: {
      response: { 200: z.object({ hello: z.string() }) },
    },
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (_, response) => {
        response.status(200).send({ hello: "dsf" });
      },
    });
  });
};
