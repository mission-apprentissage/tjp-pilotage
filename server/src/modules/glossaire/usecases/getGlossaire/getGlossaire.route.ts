import { createRoute } from "@http-wizard/core";
import type NodeCache from "node-cache";

import type { Server } from "@/server/server";
import { CACHE_KEYS } from "@/utils/cacheKeys";

import type { GlossaireEntry } from "./getGlossaire.schema";
import { getGlossaireSchema } from "./getGlossaire.schema";
import { getGlossaire } from "./getGlossaire.usecase";

export const getGlossaireRoute = ({ server, cache }: { server: Server; cache: NodeCache }) => {
  return createRoute("/glossaire", {
    method: "GET",
    schema: getGlossaireSchema,
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
