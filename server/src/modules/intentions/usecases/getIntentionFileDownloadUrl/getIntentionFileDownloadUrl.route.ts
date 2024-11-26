import { createRoute } from "@http-wizard/core";
import { ROUTES } from "shared/routes/routes";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { getIntentionFileDownloadUrlUseCase } from "./getIntentionFileDownloadUrl.usecase";

const ROUTE = ROUTES["[GET]/intention/:numero/files/url"];

export const getIntentionFileDownloadUrlRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions-perdir/lecture"),
      handler: async (request, response) => {
        const url = await getIntentionFileDownloadUrlUseCase(request.params.numero, request.query.filename);

        response.status(200).send({
          url,
        });
      },
    });
  });
};
