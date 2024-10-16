import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { getFormationSchema } from "./getFormation.schema";
import { getFormationUsecase } from "./getFormation.usecase";

export const getFormationRoute = (server: Server) => {
  return createRoute("/formation/:cfd", {
    method: "GET",
    schema: getFormationSchema,
  }).handle((props) =>
    server.route({
      ...props,
      handler: async (request, response) => {
        const { cfd } = request.params;
        const result = await getFormationUsecase(cfd, request.query);
        response.status(200).send(result);
      },
    })
  );
};
