import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { getScopedTauxTransformationSchema } from "./getScopedTauxTransformation.schema";
import { getScopedTauxTransformation } from "./getScopedTauxTransformation.usecase";

export const getScopedTauxTransformationRoute = ({
  server,
}: {
  server: Server;
}) => {
  return createRoute(
    "/pilotage-transformation/get-scoped-taux-transformations",
    {
      method: "GET",
      schema: getScopedTauxTransformationSchema,
    }
  ).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("pilotage-intentions/lecture"),
      handler: async (request, response) => {
        const statsTauxTransfo = await getScopedTauxTransformation(
          request.query
        );
        response.status(200).send(statsTauxTransfo);
      },
    });
  });
};
