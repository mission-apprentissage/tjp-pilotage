import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { hasPermissionHandler } from "../../../core";
import { countDemandesSchema } from "./countDemandes.schema";
import { countDemandesUsecase } from "./countDemandes.usecase";

export const countDemandesRoute = (server: Server) => {
  return createRoute("/demandes/count", {
    method: "GET",
    schema: countDemandesSchema,
  }).handle((props) => {
    server.route({
      ...props,
      preHandler: hasPermissionHandler("intentions/lecture"),
      handler: async (request, response) => {
        const { anneeCampagne, codeAcademie, codeNiveauDiplome, search } =
          request.query;

        const result = await countDemandesUsecase({
          user: request.user!,
          anneeCampagne,
          codeAcademie,
          codeNiveauDiplome,
          search,
        });
        response.status(200).send(result);
      },
    });
  });
};
