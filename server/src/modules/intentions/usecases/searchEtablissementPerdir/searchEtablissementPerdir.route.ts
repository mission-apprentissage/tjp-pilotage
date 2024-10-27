import { createRoute } from "@http-wizard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { searchEtablissementPerdirSchema } from "./searchEtablissementPerdir.schema";
import { searchEtablissementPerdirUsecase } from "./searchEtablissementPerdir.usecase";

export const searchEtablissementPerdirRoute = (server: Server) => {
  return createRoute("/etablissement/perdir/search/:search", {
    method: "GET",
    schema: searchEtablissementPerdirSchema,
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
