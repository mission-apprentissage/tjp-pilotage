import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

import { PROPERTIES } from "./properties";

export const getPropertyOrder = (page: PageObjectResponse): number | undefined => {
  const property = page.properties[PROPERTIES.ORDRE];

  if (property?.type !== "number") {
    return undefined;
  }

  return property?.number ?? undefined;
};
