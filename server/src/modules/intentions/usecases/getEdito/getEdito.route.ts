import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizzard/core";

import type { RequestUser } from "@/modules/core/model/User";
import type { Server } from "@/server/server";

import { getEditoUsecase } from "./getEdito.usecase";

const ROUTE = ROUTES["[GET]/edito"];

export const getEditoRoute = (server: Server) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const user = request.user as RequestUser;
        const editoContent = await getEditoUsecase(user);

        response.status(200).send(editoContent);
      },
    });
  });
};
