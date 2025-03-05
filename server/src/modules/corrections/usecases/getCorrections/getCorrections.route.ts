import {PermissionEnum} from 'shared/enum/permissionEnum';
import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import { hasPermissionHandler } from "@/modules/core/utils/hasPermission";
import type { Server } from "@/server/server";

import { getCorrectionsUsecase } from "./getCorrections.usecase";

const ROUTE = ROUTES["[GET]/corrections"];

export const getCorrectionsRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler(PermissionEnum["intentions/lecture"]),
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
