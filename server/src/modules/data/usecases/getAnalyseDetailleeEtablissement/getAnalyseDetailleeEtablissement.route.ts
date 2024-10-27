import { createRoute } from "@http-wizard/core";

import type { Server } from "@/server/server";

import { getAnalyseDetailleeEtablissementSchema } from "./getAnalyseDetailleeEtablissement.schema";
import { getAnalyseDetailleeEtablissement } from "./getAnalyseDetailleeEtablissement.usecase";

export const getAnalyseDetailleeEtablissementRoute = ({ server }: { server: Server }) => {
  return createRoute("/etablissement/:uai/analyse-detaillee", {
    method: "GET",
    schema: getAnalyseDetailleeEtablissementSchema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { uai } = request.params;
        const analyseDetaillee = await getAnalyseDetailleeEtablissement({
          uai,
        });
        response.status(200).send(analyseDetaillee);
      },
    });
  });
};
