import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { searchDomaineProfessionnelSchema } from "./searchDomaineProfessionnel.schema";
import { searchDomaineProfessionnel } from "./searchDomaineProfessionnel.usecase";

export const searchDomaineProfessionnelRoute = ({
  server,
}: {
  server: Server;
}) => {
  return createRoute("/domaine-professionnel/search/:search", {
    method: "GET",
    schema: searchDomaineProfessionnelSchema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { search } = request.params;
        const result = await searchDomaineProfessionnel({
          search,
        });
        response.status(200).send(result);
      },
    });
  });
};
