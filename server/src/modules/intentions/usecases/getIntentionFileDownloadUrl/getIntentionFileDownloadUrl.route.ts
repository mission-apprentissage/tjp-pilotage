import { createRoute } from "@http-wizard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { getIntentionFileDownloadUrlSchema } from "./getIntentionFileDownloadUrl.schema";
import { getIntentionFileDownloadUrlUseCase } from "./getIntentionFileDownloadUrl.usecase";

export const getIntentionFileDownloadUrlRoute = (server: Server) => {
  return createRoute("/intention/:numero/files/url", {
    method: "GET",
    schema: getIntentionFileDownloadUrlSchema,
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
