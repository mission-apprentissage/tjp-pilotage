import { createRoute } from "@http-wizard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { submitAvisSchema } from "./submitAvis.schema";
import { submitAvisUsecase } from "./submitAvis.usecase";

export const submitAvisRoute = ({ server }: { server: Server }) => {
  return createRoute("/intention/avis/submit", {
    method: "POST",
    schema: submitAvisSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions-perdir-avis/ecriture"),
      handler: async (request, response) => {
        const { avis } = request.body;

        const result = await submitAvisUsecase({
          user: request.user!,
          avis,
        });
        response.status(200).send(result);
      },
    });
  });
};
