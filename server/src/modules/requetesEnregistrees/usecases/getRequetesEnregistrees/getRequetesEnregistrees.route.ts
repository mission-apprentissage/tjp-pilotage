import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { getRequetesEnregistrees } from "./getRequetesEnregistrees.query";
import { getRequetesEnregistreesSchema } from "./getRequetesEnregistrees.schema";

export const getRequetesEnregistreesRoute = (server: Server) => {
  return createRoute("/requetes", {
    method: "GET",
    schema: getRequetesEnregistreesSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("enregistrement-requete/lecture"),
      handler: async (request, response) => {
        const { page } = request.query;
        const requetesEnregistrees = await getRequetesEnregistrees({
          user: request.user!,
          page,
        });

        response.status(200).send(requetesEnregistrees);
      },
    });
  });
};
