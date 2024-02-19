import { createRoute } from "@http-wizard/core";
import NodeCache from "node-cache";

import { Server } from "../../../../server";
import { CACHE_KEYS } from "../../../../utils/cacheKeys";
import {
  getGlossaireEntrySchema,
  GlossaireEntry,
} from "./getGlossaireEntry.schema";
import { getGlossaireEntry } from "./getGlossaireEntry.usecase";

export const getGlossaireEntryRoute = ({
  server,
  cache,
}: {
  server: Server;
  cache: NodeCache;
}) => {
  return createRoute("/glossaire/:id", {
    method: "GET",
    schema: getGlossaireEntrySchema,
  }).handle((props) => {
    server.route({
      ...props,
      handler: async (request, response) => {
        if (cache.has(CACHE_KEYS.GLOSSAIRE_ENTRY(request.params.id))) {
          const glossaireEntry = cache.take<GlossaireEntry>(
            CACHE_KEYS.GLOSSAIRE_ENTRY(request.params.id)
          );
          response.status(200).send(glossaireEntry);
          return;
        }

        const glossaireEntry = await getGlossaireEntry(request.params.id);
        cache.set(
          CACHE_KEYS.GLOSSAIRE_ENTRY(request.params.id),
          glossaireEntry
        );
        response.status(200).send(glossaireEntry);
      },
    });
  });
};
