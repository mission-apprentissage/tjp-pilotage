import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { getEditoSchema } from "./getEdito.schema";
import { getEditoUsecase } from "./getEdito.usecase";

export const getEditoRoute = (server: Server) => {
  return createRoute("/edito", {
    method: "GET",
    schema: getEditoSchema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (_request, response) => {
        const editoContent = await getEditoUsecase();

        response.status(200).send(editoContent);
      },
    });
  });
};
