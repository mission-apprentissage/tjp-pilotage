import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

import { PROPERTIES } from "./properties";

export const getPropertyStatut = (page: PageObjectResponse): string | undefined => {
  const property = page.properties[PROPERTIES.STATUT];

  if (property?.type !== "select") {
    return undefined;
  }

  return property.select?.name;
};
