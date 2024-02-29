import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { getAnalyseDetailleeEtablissementSchema } from "./getAnalyseDetailleeEtablissement.schema";
import { getAnalyseDetailleeEtablissement } from "./getAnalyseDetailleeEtablissement.usecase";

export const getAnalyseDetailleeEtablissementRoute = ({
  server,
}: {
  server: Server;
}) => {
  return createRoute("/etablissement/analyse-detaillee", {
    method: "GET",
    schema: getAnalyseDetailleeEtablissementSchema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const filters = request.query;
        const analyseDetaillee =
          await getAnalyseDetailleeEtablissement(filters);
        response.status(200).send(analyseDetaillee);
      },
    });
  });
};
