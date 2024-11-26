import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

import { getPageIcon } from "@/modules/glossaire/usecases/utils/getPageIcon";
import { getPropertyIndicateur } from "@/modules/glossaire/usecases/utils/properties/getPropertyIndicateur";
import { getPropertyStatut } from "@/modules/glossaire/usecases/utils/properties/getPropertyStatut";
import { getPropertyTitre } from "@/modules/glossaire/usecases/utils/properties/getPropertyTitre";

import type { GlossaireEntry } from "./getGlossaireEntry.schema";

const mapNotionPageToGlossaireEntry = (id: string, page: PageObjectResponse): GlossaireEntry => {
  return {
    id,
    icon: getPageIcon(page),
    title: getPropertyTitre(page),
    indicator: getPropertyIndicateur(page),
    status: getPropertyStatut(page),
  };
};

export const dependencies = {
  mapNotionPageToGlossaireEntry,
};
