import * as Boom from "@hapi/boom";
import {PermissionEnum} from 'shared/enum/permissionEnum';
import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { submitDemandeUsecase } from "./submitDemande.usecase";

const ROUTE = ROUTES["[POST]/demande/submit"];

export const submitDemandeRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler(PermissionEnum["demande/ecriture"]),
      handler: async (request, response) => {
        const { demande, isModificationUaiCfd } = request.body;
        if (!request.user) throw Boom.unauthorized();

        const result = await submitDemandeUsecase({
          demande,
          isModificationUaiCfd,
          user: request.user,
        });
        response.status(200).send(result);
      },
    });
  });
};
