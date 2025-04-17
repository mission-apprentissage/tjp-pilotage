import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import type { EditoEntry } from "shared/routes/schemas/get.edito.schema";

const PROPERTIES = {
  TITRE: "TITRE",
  MESSAGE: "MESSAGE",
  EN_LIGNE: "EN LIGNE ?",
  LIEN: "LIEN",
  DATE_CREATION: "DATE DE CRÉATION",
  ORDER: "ORDER",
  REGION: "RÉGION",
};

const getProperty = (page: PageObjectResponse, key: keyof typeof PROPERTIES): string | undefined => {
  const property = page.properties[key];

  if (property?.type === "title") {
    return property.title[0]?.plain_text;
  }

  if (property?.type === "rich_text") return property.rich_text[0]?.plain_text;
  if (property?.type === "url") return property.url ?? undefined;
  if (property?.type === "date") return property.date?.start;
  if (property?.type === "number") return property.number?.toString();
  if (property?.type === "select") return property.select?.name;
  return undefined;
};

export const mapNotionDatabaseRowToEditoEntry = (pages: PageObjectResponse[]) => {
  const entries: EditoEntry[] = [];

  for (const page of pages) {
    entries.push({
      id: page.id,
      titre: getProperty(page, PROPERTIES.TITRE as keyof typeof PROPERTIES),
      message: getProperty(page, PROPERTIES.MESSAGE as keyof typeof PROPERTIES),
      lien: getProperty(page, PROPERTIES.LIEN as keyof typeof PROPERTIES),
      date_creation: getProperty(page, PROPERTIES.DATE_CREATION as keyof typeof PROPERTIES),
      order: getProperty(page, PROPERTIES.ORDER as keyof typeof PROPERTIES),
      en_ligne: getProperty(page, PROPERTIES.EN_LIGNE as keyof typeof PROPERTIES),
      region: getProperty(page, PROPERTIES.REGION as keyof typeof PROPERTIES),
    });
  }

  return entries;
};
