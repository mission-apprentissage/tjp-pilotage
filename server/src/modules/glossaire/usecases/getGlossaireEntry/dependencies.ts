import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

import { getPageIcon } from "../utils/getPageIcon";
import { getPropertyIndicateur } from "../utils/properties/getPropertyIndicateur";
import { getPropertyStatut } from "../utils/properties/getPropertyStatut";
import { getPropertyTitre } from "../utils/properties/getPropertyTitre";
import { GlossaireEntry } from "./getGlossaireEntry.schema";

const mapNotionPageToGlossaireEntry = (
  id: string,
  page: PageObjectResponse
): GlossaireEntry => {
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
