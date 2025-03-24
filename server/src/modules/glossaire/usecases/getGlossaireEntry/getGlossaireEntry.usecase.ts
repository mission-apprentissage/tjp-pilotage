import { getGlossaireEntryFromMarkdown } from "./dependencies/getGlossaireEntryFromMarkdown.dep";

export const getGlossaireEntryFactory =
  (
    deps = {
      getGlossaireEntryFromMarkdown,
    }
  ) =>
    async (slug: string) => {
      return deps.getGlossaireEntryFromMarkdown(slug);
    };

export const getGlossaireEntry = getGlossaireEntryFactory();
