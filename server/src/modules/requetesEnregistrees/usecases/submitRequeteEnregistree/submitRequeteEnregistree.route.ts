import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { submitRequeteEnregistreeUsecase } from "./submitRequeteEnregistree.usecase";

const ROUTE = ROUTES["[POST]/requete/enregistrement"];

export const submitRequeteEnregistreeRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("enregistrement-requete/ecriture"),
      handler: async (request, response) => {
        const requeteEnregistree = request.body;

        const result = await submitRequeteEnregistreeUsecase({
          user: request.user!,
          requeteEnregistree,
        });
        response.status(200).send(result);
      },
    });
  });
};
