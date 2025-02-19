import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizzard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { getRequetesEnregistrees } from "./getRequetesEnregistrees.query";

const ROUTE = ROUTES["[GET]/requetes"];

export const getRequetesEnregistreesRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("enregistrement-requete/lecture"),
      handler: async (request, response) => {
        const { page } = request.query;
        const requetesEnregistrees = await getRequetesEnregistrees({
          user: request.user!,
          page,
        });

        response.status(200).send(requetesEnregistrees);
      },
    });
  });
};
