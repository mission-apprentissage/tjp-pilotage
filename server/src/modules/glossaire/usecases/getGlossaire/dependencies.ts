import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { getPageIcon } from "../utils/getPageIcon";
import { getPropertyIndicateur } from "../utils/properties/getPropertyIndicateur";
import { getPropertyStatut } from "../utils/properties/getPropertyStatut";
import { getPropertyTitre } from "../utils/properties/getPropertyTitre";
import { GlossaireEntry } from "./getGlossaire.schema";

export const mapNotionDatabaseRowToGlossaireEntry = (
  pages: PageObjectResponse[]
) => {
  const entries: GlossaireEntry[] = [];

  for (const page of pages) {
    entries.push({
      id: page.id,
      title: getPropertyTitre(page),
      indicator: getPropertyIndicateur(page),
      status: getPropertyStatut(page),
      icon: getPageIcon(page),
    });
  }

  return entries;
};

export const dependencies = {
  mapNotionDatabaseRowToGlossaireEntry,
};
