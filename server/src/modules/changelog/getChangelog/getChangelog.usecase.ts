import type { Changelog, ChangelogEntry } from "shared/routes/schemas/get.changelog.schema";

import config from "@/config";
import { getDatabaseRows } from "@/modules/core/services/notion/notion";

/**
 * AUTO GENERATED TYPES
 */
export interface ChangelogDatabase {
  object: string;
  results?: ResultsEntity[];
  next_cursor?: null;
  has_more: boolean;
  type: string;
  page_or_database: object;
  request_id?: string;
}
export interface ResultsEntity {
  object: string;
  id: string;
  created_time: string;
  last_edited_time: string;
  created_by: CreatedByOrLastEditedByOrUser;
  last_edited_by: CreatedByOrLastEditedByOrUser;
  cover?: null;
  icon?: null;
  parent: Parent;
  archived: boolean;
  properties: Properties;
  url: string;
  public_url: string;
}

export interface CreatedByOrLastEditedByOrUser {
  object: string;
  id: string;
}

export interface Parent {
  type: string;
  database_id: string;
}

export interface Properties {
  Description: DescriptionOrDate;
  Type: Type;
  Documentation: Documentation;
  "En Prod ?": NotionCheckbox;
  Commentaire: Commentaire;
  Date: PropertyDate;
  "Mise à jour": MiseAJour;
  "A afficher": NotionCheckbox;
}

export interface DescriptionOrDate {
  id: string;
  type: string;
  rich_text?: Array<RichTextEntityOrTitleEntity>;
}

export interface RichTextEntityOrTitleEntity {
  type: string;
  text: Text;
  annotations: Annotations;
  plain_text: string;
  href?: null;
}
export interface Text {
  content: string;
  link?: null;
}
export interface Annotations {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
  code: boolean;
  color: string;
}
export interface Type {
  id: string;
  type: string;
  multi_select?: MultiSelectEntity[] | null;
}
export interface MultiSelectEntity {
  id: string;
  name: string;
  color: string;
}
export interface Documentation {
  id: string;
  type: string;
  files?: null[] | null;
}
export interface NotionCheckbox {
  id: string;
  type: string;
  checkbox: boolean;
}
export interface Commentaire {
  id: string;
  type: string;
  rich_text?: (RichTextEntity | null)[] | null;
}
export interface RichTextEntity {
  type: string;
  mention?: Mention | null;
  annotations: Annotations;
  plain_text: string;
  href?: null;
  text?: Text | null;
}

export interface Mention {
  type: string;
  user?: CreatedByOrLastEditedByOrUser;
  date?: TimeFrame;
}

export interface TimeFrame {
  start: string;
  end?: null;
  time_zone?: null;
}

export interface PropertyDate {
  id: string;
  type: string;
  rich_text?: RichTextEntity[] | null;
}

export interface MiseAJour {
  id: string;
  type: string;
  title?: Array<RichTextEntityOrTitleEntity>;
}

/**
 * AUTO GENERATED TYPES
 */

export const getChangelogFactory =
  (
    deps = {
      getDatabaseRows,
      config,
    }
  ) =>
  async (dbId: string = deps.config.notion.dbChangelogId): Promise<Changelog> => {
    const database = (await deps.getDatabaseRows(dbId)) as unknown as ChangelogDatabase;
    const changelog: Changelog = [];

    database.results?.forEach((result) => {
      const entry: Partial<ChangelogEntry> = {};

      entry.title = result.properties["Mise à jour"].title?.[0]?.plain_text ?? "";

      if (!entry.title) {
        return;
      }

      entry.id = result.id;

      entry.types =
        result.properties.Type.multi_select?.map((type) => ({
          label: type.name,
          color: type.color,
        })) ?? [];

      entry.show = result.properties["A afficher"].checkbox;
      entry.description = result.properties["Description"].rich_text?.[0]?.plain_text ?? "";
      entry.deployed = result.properties["En Prod ?"].checkbox;

      if (result.properties.Date.type === "rich_text") {
        entry.date = {
          type: result.properties.Date.rich_text?.[0]?.type === "mention" ? "date" : "string",
          value: result.properties.Date.rich_text?.[0]?.plain_text ?? "",
        };
      }

      changelog.push(entry as ChangelogEntry);
    });

    changelog.sort((a, b) => {
      if (a.date.type === "date" && b.date.type === "date") {
        return new Date(b.date.value).getTime() - new Date(a.date.value).getTime();
      }

      return 0;
    });

    return changelog;
  };

export const getChangelog = getChangelogFactory();
