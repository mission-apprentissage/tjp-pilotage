import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { submitCorrectionSchema } from "./submitCorrection.schema";
import { submitCorrectionUsecase } from "./submitCorrection.usecase";

export const submitCorrectionRoute = (server: Server) => {
  return createRoute("/correction/submit", {
    method: "POST",
    schema: submitCorrectionSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions/lecture"),
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
