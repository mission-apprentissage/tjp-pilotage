import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { getDataForEtablissementMapListSchema } from "./getDataForEtablissementMapList.schema";
import { getDataForEtablissementMapList } from "./getDataForEtablissementMapList.usecase";

export const getDataForEtablissementMapListRoute = ({
  server,
}: {
  server: Server;
}) => {
  return createRoute("/etablissement/:uai/map/list", {
    method: "GET",
    schema: getDataForEtablissementMapListSchema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        console.log("tt");
        const stats = await getDataForEtablissementMapList(
          { ...request.params },
          { ...request.query }
        );
        response.status(200).send({
          ...stats,
        });
      },
    });
  });
};
