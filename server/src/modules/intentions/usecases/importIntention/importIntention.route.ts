import { createRoute } from "@http-wizard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { importIntentionSchema } from "./importIntention.schema";
import { importIntentionUsecase } from "./importIntention.usecase";

export const importIntentionRoute = (server: Server) => {
  return createRoute("/intention/import/:numero", {
    method: "POST",
    schema: importIntentionSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions-perdir/lecture"),
      handler: async (request, response) => {
        const user = request.user!;

        const intention = await importIntentionUsecase({
          numero: request.params.numero,
          user,
        });
        if (!intention) return response.status(404).send();

        const result = response.status(200).send(intention);

        return result;
      },
    });
  });
};
