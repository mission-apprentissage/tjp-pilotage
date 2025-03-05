import {PermissionEnum} from 'shared/enum/permissionEnum';
import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { uploadIntentionFilesUsecase } from "./uploadIntentionFiles.usecase";

const ROUTE = ROUTES["[PUT]/intention/:numero/files"];

export const uploadIntentionFilesRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler(PermissionEnum["intentions-perdir/ecriture"]),
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
