import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { getFormationsTransformationsSchema } from "./getFormationsTransformations.schema";
import { getFormationsTransformationStats } from "./getFormationsTransformationStats.usecase";

export const getFormationsTransformationsRoute = ({
  server,
}: {
  server: Server;
}) => {
  return createRoute("/pilotage-transformation/formations", {
    method: "GET",
    schema: getFormationsTransformationsSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("pilotage-intentions/lecture"),
      handler: async (request, response) => {
        const { order, orderBy, ...filters } = request.query;
        const stats = await getFormationsTransformationStats({
          ...filters,
          orderBy: order && orderBy ? { order, column: orderBy } : undefined,
        });
        response.status(200).send(stats);
      },
    });
  });
};
