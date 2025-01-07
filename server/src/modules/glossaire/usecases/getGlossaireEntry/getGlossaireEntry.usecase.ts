import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

import { getPageAsMarkdown, getPageProperties } from "@/modules/core/services/notion/notion";

import { dependencies } from "./dependencies";

export const getGlossaireEntryFactory =
  (
    deps = {
      getPageProperties,
      getPageAsMarkdown,
      mapNotionPageToGlossaireEntry: dependencies.mapNotionPageToGlossaireEntry,
    }
  ) =>
    async (id: string) => {
      const page = await deps.getPageProperties(id);
      const content = await deps.getPageAsMarkdown(id);

      const entry = deps.mapNotionPageToGlossaireEntry(id, page as PageObjectResponse);

      return {
        ...entry,
        content,
      };
    };

export const getGlossaireEntry = getGlossaireEntryFactory();
