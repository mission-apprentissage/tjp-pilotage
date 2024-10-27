import { createRoute } from "@http-wizard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { deleteIntentionFilesSchema } from "./deleteIntentionFiles.schema";
import { deleteIntentionFilesUseCase } from "./deleteIntentionFiles.usecase";

export const deleteIntentionFilesRoute = (server: Server) => {
  return createRoute("/intention/:numero/files", {
    method: "DELETE",
    schema: deleteIntentionFilesSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions-perdir/ecriture"),
      handler: async (request, response) => {
        const { numero } = request.params;
        const { files } = request.body;
        await deleteIntentionFilesUseCase({ numero, files });
        response.status(200).send();
      },
    });
  });
};
