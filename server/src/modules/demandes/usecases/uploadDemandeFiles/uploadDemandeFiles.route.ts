import {PermissionEnum} from 'shared/enum/permissionEnum';
import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { uploadDemandeFilesUsecase } from "./uploadDemandeFiles.usecase";

const ROUTE = ROUTES["[PUT]/demande/:numero/files"];

export const uploadDemandeFilesRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler(PermissionEnum["demande/ecriture"]),
      handler: async (request, response) => {
        // @ts-ignore
        const files = request.files();

        for await (const file of files) {
          const bufferedFile = await file.toBuffer();

          await uploadDemandeFilesUsecase({
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
