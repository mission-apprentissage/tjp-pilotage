import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { deleteIntentionFilesUseCase } from "./deleteIntentionFiles.usecase";

const ROUTE = ROUTES["[DELETE]/intention/:numero/files"];

export const deleteIntentionFilesRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
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
