import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { config } from "../../../../../config/config";
import * as notion from "../../services/notion/notion";
import { dependencies } from "./dependencies";

export const getGlossaireFactory =
  (
    deps = {
      getDatabaseRows: notion.getDatabaseRows,
      mapNotionDatabaseRowToGlossaireEntry:
        dependencies.mapNotionDatabaseRowToGlossaireEntry,
      config: config,
    }
  ) =>
  async (dbId: string = deps.config.notion.dbGlossaireId) => {
    const database = await deps.getDatabaseRows(dbId);

    const entries = deps.mapNotionDatabaseRowToGlossaireEntry(
      database.results as PageObjectResponse[]
    );

    return entries;
  };

export const getGlossaire = getGlossaireFactory();
