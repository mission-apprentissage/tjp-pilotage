import {PermissionEnum} from 'shared/enum/permissionEnum';
import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { deleteDemandeFilesUseCase } from "./deleteDemandeFiles.usecase";

const ROUTE = ROUTES["[DELETE]/demande/:numero/files"];

export const deleteDemandeFilesRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler(PermissionEnum["demande/ecriture"]),
      handler: async (request, response) => {
        const { numero } = request.params;
        const { files } = request.body;
        await deleteDemandeFilesUseCase({ numero, files });
        response.status(200).send();
      },
    });
  });
};
