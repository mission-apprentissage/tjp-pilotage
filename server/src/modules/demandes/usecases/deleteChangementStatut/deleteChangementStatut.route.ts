import {PermissionEnum} from 'shared/enum/permissionEnum';
import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import type { RequestUser } from "@/modules/core/model/User";
import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { deleteChangementStatutUsecase } from "./deleteChangementStatut.usecase";

const ROUTE = ROUTES["[DELETE]/demande/statut/:id"];

export const deleteChangementStatutRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler(PermissionEnum["demande-statut/ecriture"]),
      handler: async (request, response) => {
        const user = request.user as RequestUser;
        await deleteChangementStatutUsecase({ id: request.params.id, user });
        response.status(200).send();
      },
    });
  });
};
