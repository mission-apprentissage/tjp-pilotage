import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { searchDiplomeSchema } from "./searchDiplome.schema";
import { searchDiplome } from "./searchDiplome.usecase";

export const searchDiplomeRoute = ({ server }: { server: Server }) => {
  return createRoute("/diplome/search/:search", {
    method: "GET",
    schema: searchDiplomeSchema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { search } = request.params;
        const result = await searchDiplome({ search });
        response.status(200).send(result);
      },
    });
  });
};
