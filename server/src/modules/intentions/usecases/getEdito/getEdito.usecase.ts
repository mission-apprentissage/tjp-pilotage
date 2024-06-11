import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

import { config } from "../../../../../config/config";
import * as notion from "../../../core/services/notion/notion";
import { mapNotionDatabaseRowToEditoEntry } from "./getEdito.query";

const getEditoFactory =
  (
    deps = {
      getDatabaseRows: notion.getDatabaseRows,
      mapNotionDatabaseRowToEditoEntry,
      config,
    }
  ) =>
  async (dbId: string = deps.config.notion.dbEditoId) => {
    const database = await deps.getDatabaseRows(dbId);

    const entries = deps.mapNotionDatabaseRowToEditoEntry(
      database.results as PageObjectResponse[]
    );

    return entries
      .sort((a, b) => a.order?.localeCompare(b.order ?? "") ?? 0)
      .filter((entry) => entry.en_ligne === "Oui");
  };

export const getEditoUsecase = getEditoFactory();
