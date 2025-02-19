import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizzard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { getIntentionFilesUseCase } from "./getIntentionFiles.usecase";

const ROUTE = ROUTES["[GET]/intention/:numero/files"];

export const getIntentionFilesRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
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
