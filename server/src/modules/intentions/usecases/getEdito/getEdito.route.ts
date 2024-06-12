import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { RequestUser } from "../../../core/model/User";
import { getEditoSchema } from "./getEdito.schema";
import { getEditoUsecase } from "./getEdito.usecase";

export const getEditoRoute = (server: Server) => {
  return createRoute("/edito", {
    method: "GET",
    schema: getEditoSchema,
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
