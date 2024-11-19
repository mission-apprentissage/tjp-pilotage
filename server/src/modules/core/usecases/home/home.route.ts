import { createRoute } from "@http-wizard/core";
import { z } from "zod";

import config from "@/config";
import type { Server } from "@/server/server";

export const homeRoute = (server: Server) => {
  return createRoute("/healthcheck", {
    method: "GET",
    schema: {
      response: {
        200: z.object({
          name: z.string(),
          version: z.string(),
          env: z.enum(["local", "recette", "recette1new", "recette2", "production", "test"]),
        }),
      },
    },
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (_, response) => {
        response.status(200).send({
          name: config.productName,
          version: config.version,
          env: config.env,
        });
      },
    });
  });
};
