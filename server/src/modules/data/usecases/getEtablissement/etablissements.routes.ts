import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { getEtablissementQuery } from "./getEtablissement.query";
import { getEtablissementSchema } from "./getEtablissement.schema";

export const getEtablissementRoute = ({ server }: { server: Server }) => {
  return createRoute("/etablissement/:uai", {
    method: "GET",
    schema: getEtablissementSchema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { uai } = request.params;
        const etablissement = await getEtablissementQuery({ uai });
        if (!etablissement) return response.status(404).send();
        response.status(200).send(etablissement);
      },
    });
  });
};
