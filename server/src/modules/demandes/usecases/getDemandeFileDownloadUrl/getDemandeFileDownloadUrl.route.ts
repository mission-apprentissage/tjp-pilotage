import {PermissionEnum} from 'shared/enum/permissionEnum';
import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { getDemandeFileDownloadUrlUsecase } from "./getDemandeFileDownloadUrl.usecase";

const ROUTE = ROUTES["[GET]/demande/:numero/files/url"];

export const getDemandeFileDownloadUrlRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler(PermissionEnum["demande/lecture"]),
      handler: async (request, response) => {
        const url = await getDemandeFileDownloadUrlUsecase(request.params.numero, request.query.filename);

        response.status(200).send({
          url,
        });
      },
    });
  });
};
