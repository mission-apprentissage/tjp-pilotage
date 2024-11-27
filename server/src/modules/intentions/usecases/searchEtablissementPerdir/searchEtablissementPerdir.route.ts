import { createRoute } from "@http-wizard/core";
import { ROUTES } from "shared/routes/routes";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { searchEtablissementPerdirUsecase } from "./searchEtablissementPerdir.usecase";

const ROUTE = ROUTES["[GET]/etablissement/perdir/search/:search"];

export const searchEtablissementPerdirRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions-perdir/lecture"),
      handler: async (request, response) => {
        const { search } = request.params;
        const { filtered } = request.query;
        const result = await searchEtablissementPerdirUsecase({
          search,
          filtered,
          user: request.user,
        });
        response.status(200).send(result);
      },
    });
  });
};
