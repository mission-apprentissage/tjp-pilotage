import { createRoute } from "@http-wizard/core";
import { ROUTES } from "shared/routes/routes";

import type { Server } from "@/server/server";

import { searchDomaineProfessionnel } from "./searchDomaineProfessionnel.usecase";

const ROUTE = ROUTES["[GET]/domaine-professionnel/search/:search"];

export const searchDomaineProfessionnelRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { search } = request.params;
        const result = await searchDomaineProfessionnel({
          search,
        });
        response.status(200).send(result);
      },
    });
  });
};
