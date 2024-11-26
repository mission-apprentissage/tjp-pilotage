import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export const getPageIcon = (page: PageObjectResponse): string | undefined => {
  if (page.icon?.type === "emoji") {
    return page.icon.emoji;
  }

  if (page.icon?.type === "external") {
    return page.icon.external.url;
  }

  if (page.icon?.type === "file") {
    return page.icon.file.url;
  }

  return undefined;
};
