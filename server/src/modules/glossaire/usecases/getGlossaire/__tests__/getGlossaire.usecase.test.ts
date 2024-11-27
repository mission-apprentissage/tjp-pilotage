import type { PageObjectResponse, QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";
import type { GlossaireEntry } from "shared/routes/schemas/get.glossaire.schema";
import { beforeEach, describe, expect, it } from "vitest";

import config from "@/config";
import { mapNotionDatabaseRowToGlossaireEntry } from "@/modules/glossaire/usecases/getGlossaire/dependencies";
import { getGlossaireFactory } from "@/modules/glossaire/usecases/getGlossaire/getGlossaire.usecase";
import { PROPERTIES } from "@/modules/glossaire/usecases/utils/properties/properties";

const GetGlossaireFixture = () => {
  const currentRows: PageObjectResponse[] = [];
  const getGlossaire = getGlossaireFactory({
    getDatabaseRows: async () => {
      return {
        results: currentRows,
      } as QueryDatabaseResponse;
    },
    config,
    mapNotionDatabaseRowToGlossaireEntry,
  });
  const entries: GlossaireEntry[] = [];

  return {
    givenDatabaseRows: (rows: PageObjectResponse[]) => {
      currentRows.push(...rows);
    },
    whenGetGlossaire: async () => {
      entries.push(...(await getGlossaire()));
    },
    thenEntriesShouldBe: (expectedEntries: GlossaireEntry[]) => {
      expect(entries).toEqual(expectedEntries);
    },
  };
};

describe("Feature: Get the glossaire list of entries from Notion DB", () => {
  let fixture: ReturnType<typeof GetGlossaireFixture>;

  beforeEach(() => {
    fixture = GetGlossaireFixture();
  });

  it("Scenario: The glossaire should return a list of topics", async () => {
    fixture.givenDatabaseRows([
      {
        object: "page",
        id: "id-page-1",
        created_time: "2024-01-09T08:56:00.000Z",
        last_edited_time: "2024-01-09T09:59:00.000Z",
        created_by: {
          object: "user",
          id: "user-1",
        },
        last_edited_by: {
          object: "user",
          id: "user-1",
        },
        cover: null,
        icon: {
          type: "file",
          file: {
            url: "url-to-icon",
            expiry_time: "2024-01-10T16:40:14.036Z",
          },
        },
        parent: {
          type: "database_id",
          database_id: "db-id-1",
        },
        archived: false,
        properties: {
          [PROPERTIES.INDICATEUR]: {
            id: "Z%5ExZ",
            type: "select",
            select: {
              id: "select-id-inserjeune",
              name: "InserJeunes",
              color: "yellow",
            },
          },
          [PROPERTIES.STATUT]: {
            id: "uI%7Dc",
            type: "select",
            select: {
              id: "select-id-a-valider",
              name: "à valider",
              color: "orange",
            },
          },
          [PROPERTIES.ORDRE]: {
            id: "%5CYjf",
            type: "number",
            number: 10,
          },
          [PROPERTIES.TITRE]: {
            id: "title",
            type: "title",
            title: [
              {
                type: "text",
                text: {
                  content: "Quadrant (Q1 à Q4)",
                  link: null,
                },
                annotations: {
                  bold: false,
                  italic: false,
                  strikethrough: false,
                  underline: false,
                  code: false,
                  color: "default",
                },
                plain_text: "Quadrant (Q1 à Q4)",
                href: null,
              },
            ],
          },
        },
        url: "https://www.notion.so/Quadrant-Q1-Q4",
        public_url: null,
        in_trash: false,
      },
      {
        object: "page",
        id: "id-page-2",
        created_time: "2024-01-09T08:55:00.000Z",
        last_edited_time: "2024-01-09T10:13:00.000Z",
        created_by: {
          object: "user",
          id: "id-user-1",
        },
        last_edited_by: {
          object: "user",
          id: "id-user-1",
        },
        cover: null,
        icon: {
          type: "emoji",
          emoji: "❓",
        },
        parent: {
          type: "database_id",
          database_id: "db-id-1",
        },
        archived: false,
        properties: {
          [PROPERTIES.INDICATEUR]: {
            id: "Z%5ExZ",
            type: "select",
            select: null,
          },
          [PROPERTIES.STATUT]: {
            id: "uI%7Dc",
            type: "select",
            select: {
              id: "select-id-a-ajouter",
              name: "à ajouter ?",
              color: "purple",
            },
          },
          [PROPERTIES.ORDRE]: {
            id: "%5CYjf",
            type: "number",
            number: 2,
          },
          [PROPERTIES.TITRE]: {
            id: "title",
            type: "title",
            title: [
              {
                type: "text",
                text: {
                  content: "Famille de Métiers",
                  link: null,
                },
                annotations: {
                  bold: false,
                  italic: false,
                  strikethrough: false,
                  underline: false,
                  code: false,
                  color: "default",
                },
                plain_text: "Famille de Métiers",
                href: null,
              },
            ],
          },
        },
        url: "https://www.notion.so/Famille-de-Metiers",
        public_url: null,
        in_trash: false,
      },
    ]);

    await fixture.whenGetGlossaire();

    fixture.thenEntriesShouldBe([
      {
        id: "id-page-2",
        title: "Famille de Métiers",
        indicator: undefined,
        icon: "❓",
        status: "à ajouter ?",
        order: 2,
      },
      {
        id: "id-page-1",
        title: "Quadrant (Q1 à Q4)",
        indicator: {
          name: "InserJeunes",
          color: "yellow",
        },
        icon: "url-to-icon",
        status: "à valider",
        order: 10,
      },
    ]);
  });
});
