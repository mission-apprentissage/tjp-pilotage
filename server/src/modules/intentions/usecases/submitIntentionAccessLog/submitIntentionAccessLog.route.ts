import { createRoute } from "@http-wizard/core";

import type { Server } from "@/server/server";

import { submitIntentionAccessLogSchema } from "./submitIntentionAccessLog.schema";
import { submitIntentionAccessLogUsecase } from "./submitIntentionAccessLog.usecase";

export const submitIntentionAccessLogRoute = (server: Server) => {
  return createRoute("/intention/access/submit", {
    method: "POST",
    schema: submitIntentionAccessLogSchema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { intention } = request.body;

        const result = await submitIntentionAccessLogUsecase({
          user: request.user!,
          intention,
        });
        response.status(200).send(result);
      },
    });
  });
};
