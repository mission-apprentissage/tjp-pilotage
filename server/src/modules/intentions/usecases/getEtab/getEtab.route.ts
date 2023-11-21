import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { getEtabSchema } from "./getEtab.schema";
import { getEtab } from "./getEtab.usecase";

export const getEtabRoute = (server: Server) => {
  return createRoute("/api/etab/:uai", {
    method: "GET",
    schema: getEtabSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions/lecture"),
      handler: async (request, response) => {
        const { uai } = request.params;
        const result = await getEtab({ uai });
        response.status(200).send(result);
      },
    });
  });
};
