import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import type { GlossaireEntryIndicator } from "shared/routes/schemas/get.glossaire.id.schema";

import { PROPERTIES } from "./properties";

export const getPropertyIndicateur = (page: PageObjectResponse): GlossaireEntryIndicator | undefined => {
  const property = page.properties[PROPERTIES.INDICATEUR];

  if (!property || property?.type !== "select") {
    return undefined;
  }

  if (!property.select) {
    return undefined;
  }

  return {
    name: property.select?.name ?? "",
    color: property.select?.color ?? "",
  };
};
