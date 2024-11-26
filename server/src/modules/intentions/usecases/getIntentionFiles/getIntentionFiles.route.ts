import { createRoute } from "@http-wizard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { getIntentionFilesSchema } from "./getIntentionFiles.schema";
import { getIntentionFilesUseCase } from "./getIntentionFiles.usecase";

export const getIntentionFilesRoute = (server: Server) => {
  return createRoute("/intention/:numero/files", {
    method: "GET",
    schema: getIntentionFilesSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions-perdir/lecture"),
      handler: async (request, response) => {
        const files = await getIntentionFilesUseCase(request.params.numero);

        response.status(200).send({ files });
      },
    });
  });
};
