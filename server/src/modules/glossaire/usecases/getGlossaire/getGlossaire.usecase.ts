import { getGlossaireEntries } from "./dependencies/getGlossaireEntries.dep";

export const getGlossaireFactory =
  (deps = { getGlossaireEntries }) =>
    async () => {
      const entries = await deps.getGlossaireEntries();
      return entries.sort((a, b) => a.title?.localeCompare(b.title ?? "") ?? 0);
    };

export const getGlossaire = getGlossaireFactory();
