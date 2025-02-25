import type NodeCache from "node-cache";
import { ROUTES } from "shared/routes/routes";
import type { GlossaireEntry } from "shared/routes/schemas/get.glossaire.id.schema";
import { createRoute } from "shared/utils/http-wizard/core";

import type { Server } from "@/server/server";
import { CACHE_KEYS } from "@/utils/cacheKeys";

import { getGlossaireEntry } from "./getGlossaireEntry.usecase";

const ROUTE = ROUTES["[GET]/glossaire/:id"];

export const getGlossaireEntryRoute = ({ server, cache }: { server: Server; cache: NodeCache }) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        if (cache.has(CACHE_KEYS.GLOSSAIRE_ENTRY(request.params.id))) {
          const glossaireEntry = cache.take<GlossaireEntry>(CACHE_KEYS.GLOSSAIRE_ENTRY(request.params.id));
          response.status(200).send(glossaireEntry);
          return;
        }

        const glossaireEntry = await getGlossaireEntry(request.params.id);
        cache.set(CACHE_KEYS.GLOSSAIRE_ENTRY(request.params.id), glossaireEntry);
        response.status(200).send(glossaireEntry);
      },
    });
  });
};
