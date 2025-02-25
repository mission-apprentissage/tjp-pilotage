import type NodeCache from "node-cache";
import { ROUTES } from "shared/routes/routes";
import type { GlossaireEntry } from "shared/routes/schemas/get.glossaire.schema";
import { createRoute } from "shared/utils/http-wizard/core";

import type { Server } from "@/server/server";
import { CACHE_KEYS } from "@/utils/cacheKeys";

import { getGlossaire } from "./getGlossaire.usecase";

const ROUTE = ROUTES["[GET]/glossaire"];

export const getGlossaireRoute = ({ server, cache }: { server: Server; cache: NodeCache }) => {
  return createRoute(ROUTE.url, {
    method: ROUTE.method,
    schema: ROUTE.schema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (_, response) => {
        if (cache.has(CACHE_KEYS.GLOSSAIRE)) {
          const glossaire = cache.take<GlossaireEntry[]>(CACHE_KEYS.GLOSSAIRE);
          response.status(200).send(glossaire);
          return;
        }

        const glossaire = await getGlossaire();
        cache.set(CACHE_KEYS.GLOSSAIRE, glossaire);
        response.status(200).send(glossaire);
      },
    });
  });
};
