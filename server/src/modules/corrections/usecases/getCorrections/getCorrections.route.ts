import { createRoute } from "@http-wizard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { getCorrectionsSchema } from "./getCorrections.schema";
import { getCorrectionsUsecase } from "./getCorrections.usecase";

export const getCorrectionsRoute = (server: Server) => {
  return createRoute("/corrections", {
    method: "GET",
    schema: getCorrectionsSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions/lecture"),
      handler: async (request, response) => {
        const user = request.user!;
        const { search, ...filters } = request.query;
        const result = await getCorrectionsUsecase({
          user,
          ...filters,
          search,
        });

        response.status(200).send({ ...result });
      },
    });
  });
};
