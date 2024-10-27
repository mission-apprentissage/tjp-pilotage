import { createRoute } from "@http-wizard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { submitCorrectionSchema } from "./submitCorrection.schema";
import { submitCorrectionUsecase } from "./submitCorrection.usecase";

export const submitCorrectionRoute = (server: Server) => {
  return createRoute("/correction/submit", {
    method: "POST",
    schema: submitCorrectionSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions/ecriture"),
      handler: async (request, response) => {
        const user = request.user!;
        const { correction } = request.body;

        const result = await submitCorrectionUsecase({
          correction,
          user,
        });

        response.status(200).send(result);
      },
    });
  });
};
