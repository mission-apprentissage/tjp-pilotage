import * as Boom from "@hapi/boom";
import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizzard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { submitDemande } from "./submitDemande.usecase";

const ROUTE = ROUTES["[POST]/demande/submit"];

export const submitDemandeRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions/ecriture"),
      handler: async (request, response) => {
        const { demande } = request.body;
        if (!request.user) throw Boom.unauthorized();

        const result = await submitDemande({
          demande,
          user: request.user,
        });
        response.status(200).send(result);
      },
    });
  });
};
