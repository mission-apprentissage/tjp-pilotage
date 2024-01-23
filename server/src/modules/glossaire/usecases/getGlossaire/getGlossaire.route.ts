import { createRoute } from "@http-wizard/core";

import { Server } from "../../../../server";
import { getGlossaireSchema } from "./getGlossaire.schema";
import { getGlossaire } from "./getGlossaire.usecase";

export const getGlossaireRoute = ({ server }: { server: Server }) => {
  return createRoute("/glossaire", {
    method: "GET",
    schema: getGlossaireSchema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (_, response) => {
        const glossaire = await getGlossaire();
        response.status(200).send(glossaire);
      },
    });
  });
};
