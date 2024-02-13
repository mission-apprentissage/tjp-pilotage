import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

import { config } from "../../../../../config/config";
import * as notion from "../../services/notion/notion";
import { PROPERTIES } from "../utils/properties/properties";
import { dependencies } from "./dependencies";

export const getGlossaireFactory =
  (
    deps = {
      getDatabaseRows: notion.getDatabaseRows,
      mapNotionDatabaseRowToGlossaireEntry:
        dependencies.mapNotionDatabaseRowToGlossaireEntry,
      config,
    }
  ) =>
  async (dbId: string = deps.config.notion.dbGlossaireId) => {
    const filters: Record<string, unknown> = {
      property: PROPERTIES.STATUT,
      select: {
        equals: "validé",
      },
    };

    const database = await deps.getDatabaseRows(dbId, filters);

    const entries = deps.mapNotionDatabaseRowToGlossaireEntry(
      database.results as PageObjectResponse[]
    );

    return entries.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  };

export const getGlossaire = getGlossaireFactory();
