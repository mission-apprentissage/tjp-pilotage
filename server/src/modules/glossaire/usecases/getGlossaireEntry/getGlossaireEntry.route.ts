import { ROUTES } from "shared/routes/routes";
import { createRoute } from "shared/utils/http-wizard/core";

import type { Server } from "@/server/server";

import { getGlossaireEntry } from "./getGlossaireEntry.usecase";

const ROUTE = ROUTES["[GET]/glossaire/:slug"];

export const getGlossaireEntryRoute = ({ server }: { server: Server; }) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        const { slug } = request.params as { slug: string };
        const entry = await getGlossaireEntry(slug);
        response.status(200).send(entry);
      },
    });
  });
};
