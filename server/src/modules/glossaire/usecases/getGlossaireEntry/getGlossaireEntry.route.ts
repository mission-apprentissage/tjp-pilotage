import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { getGlossaireEntrySchema } from "./getGlossaireEntry.schema";
import { getGlossaireEntry } from "./getGlossaireEntry.usecase";

export const getGlossaireEntryRoute = ({ server }: { server: Server }) => {
  return createRoute("/glossaire/:id", {
    method: "GET",
    schema: getGlossaireEntrySchema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const glossaireEntry = await getGlossaireEntry(request.params.id);
        response.status(200).send(glossaireEntry);
      },
    });
  });
};
