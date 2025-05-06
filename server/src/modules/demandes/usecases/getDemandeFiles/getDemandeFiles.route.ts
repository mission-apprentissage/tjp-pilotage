import {PermissionEnum} from 'shared/enum/permissionEnum';
import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { getDemandeFilesUsecase } from "./getDemandeFiles.usecase";

const ROUTE = ROUTES["[GET]/demande/:numero/files"];

export const getDemandeFilesRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler(PermissionEnum["demande/lecture"]),
      handler: async (request, response) => {

        const { numero } = request.params;
        const files = await getDemandeFilesUsecase(numero);

        response.status(200).send({ files });
      },
    });
  });
};
