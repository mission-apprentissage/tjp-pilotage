import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizzard/core";

import type { RequestUser } from "@/modules/core/model/User";
import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { deleteRequeteEnregistreeUsecase } from "./deleteRequeteEnregistree.usecase";

const ROUTE = ROUTES["[DELETE]/requeteEnregistree/:id"];

export const deleteRequeteEnregistreeRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("enregistrement-requete/ecriture"),
      handler: async (request, response) => {
        const user = request.user as RequestUser;
        await deleteRequeteEnregistreeUsecase({ id: request.params.id, user });
        response.status(200).send();
      },
    });
  });
};
