import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import type { GlossaireEntry } from "shared/routes/schemas/get.glossaire.schema";

import { getPageIcon } from "@/modules/glossaire/usecases/utils/getPageIcon";
import { getPropertyIndicateur } from "@/modules/glossaire/usecases/utils/properties/getPropertyIndicateur";
import { getPropertyOrder } from "@/modules/glossaire/usecases/utils/properties/getPropertyOrder";
import { getPropertyStatut } from "@/modules/glossaire/usecases/utils/properties/getPropertyStatut";
import { getPropertyTitre } from "@/modules/glossaire/usecases/utils/properties/getPropertyTitre";

export const mapNotionDatabaseRowToGlossaireEntry = (pages: PageObjectResponse[]) => {
  const entries: GlossaireEntry[] = [];

  for (const page of pages) {
    entries.push({
      id: page.id,
      title: getPropertyTitre(page),
      indicator: getPropertyIndicateur(page),
      status: getPropertyStatut(page),
      icon: getPageIcon(page),
      order: getPropertyOrder(page),
    });
  }

  return entries;
};

export const dependencies = {
  mapNotionDatabaseRowToGlossaireEntry,
};
