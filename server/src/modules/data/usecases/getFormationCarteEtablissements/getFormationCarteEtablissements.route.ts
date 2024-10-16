import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { getFormationCarteEtablissementsSchema } from "./getFormationCarteEtablissements.schema";
import { getFormationCarteEtablissementsUsecase } from "./getFormationCarteEtablissements.usecase";

export const getFormationCarteEtablissementsRoute = (server: Server) => {
  return createRoute("/formation/:cfd/map", {
    method: "GET",
    schema: getFormationCarteEtablissementsSchema,
  }).handle((props) =>
    server.route({
      ...props,
      handler: async (request, response) => {
        const result = await getFormationCarteEtablissementsUsecase(
          { ...request.params },
          { ...request.query }
        );
        response.status(200).send(result);
      },
    })
  );
};
