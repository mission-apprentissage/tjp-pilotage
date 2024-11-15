import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { submitSuiviSchema } from "./submitSuivi.schema";
import { submitSuiviUsecase } from "./submitSuivi.usecase";

export const submitSuiviRoute = (server: Server) => {
  return createRoute("/intention/suivi", {
    method: "POST",
    schema: submitSuiviSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions-perdir/lecture"),
      handler: async (request, response) => {
        const { intentionNumero } = request.body;

        const result = await submitSuiviUsecase({
          user: request.user!,
          intentionNumero,
        });
        response.status(200).send(result);
      },
    });
  });
};
