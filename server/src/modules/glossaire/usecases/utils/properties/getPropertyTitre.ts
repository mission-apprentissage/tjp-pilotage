import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

import { PROPERTIES } from "./properties";

export const getPropertyTitre = (page: PageObjectResponse): string | undefined => {
  const property = page.properties[PROPERTIES.TITRE];

  if (property?.type !== "title") {
    return undefined;
  }

  return property.title[0]?.plain_text;
};
