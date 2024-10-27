import { createRoute } from "@http-wizard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { uploadIntentionFilesSchema } from "./uploadIntentionFiles.schema";
import { uploadIntentionFilesUsecase } from "./uploadIntentionFiles.usecase";

export const uploadIntentionFilesRoute = (server: Server) => {
  return createRoute("/intention/:numero/files", {
    method: "PUT",
    schema: uploadIntentionFilesSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions-perdir/ecriture"),
      handler: async (request, response) => {
        // @ts-ignore
        const files = request.files();

        for await (const file of files) {
          const bufferedFile = await file.toBuffer();

          await uploadIntentionFilesUsecase({
            file: bufferedFile,
            id: request.params.numero,
            filename: file.filename,
          });
        }

        response.status(200).send();
      },
    });
  });
};
