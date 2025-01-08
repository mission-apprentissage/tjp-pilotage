import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

import config from "@/config";
import type { RequestUser } from "@/modules/core/model/User";
import * as notion from "@/modules/core/services/notion/notion";

import { mapNotionDatabaseRowToEditoEntry } from "./getEdito.query";

const getEditoFactory =
  (
    deps = {
      getDatabaseRows: notion.getDatabaseRows,
      mapNotionDatabaseRowToEditoEntry,
      config,
    },
  ) =>
  async (user: RequestUser, dbId: string = deps.config.notion.dbEditoId) => {
    const database = await deps.getDatabaseRows(dbId);

    const entries = deps.mapNotionDatabaseRowToEditoEntry(database.results as PageObjectResponse[]);

    return entries
      .sort((a, b) => a.order?.localeCompare(b.order ?? "") ?? 0)
      .filter((entry) => entry.en_ligne === "Oui")
      .filter((entry) => {
        if (!entry.region) return true;
        if (entry.region === user.codeRegion) return true;
        return false;
      });
  };

export const getEditoUsecase = getEditoFactory();
