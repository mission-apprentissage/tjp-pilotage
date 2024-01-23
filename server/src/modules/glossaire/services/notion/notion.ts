import Boom from "@hapi/boom";
import { APIErrorCode, Client, isNotionClientError } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

export const notionClient = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const notionToMarkdownClient = new NotionToMarkdown({
  notionClient: notionClient,
});

type CallbackFunction<K extends any[], T> = (...args: K) => Promise<T>;

const withNotionErrorHandling =
  <K extends any[], T>(callback: CallbackFunction<K, T>) =>
  async (...args: K): Promise<T> => {
    try {
      return await callback(...args);
    } catch (error) {
      if (isNotionClientError(error)) {
        switch (error.code) {
          case APIErrorCode.ObjectNotFound:
            throw Boom.notFound("Base de donnée Notion introuvable");
          case APIErrorCode.Unauthorized:
            throw Boom.unauthorized("Token Notion invalide");
          case APIErrorCode.RateLimited:
            throw Boom.tooManyRequests("Trop de requêtes Notion");
          default:
            throw Boom.badImplementation(
              "Erreur inattendue lors de la communication avec Notion"
            );
        }
      }

      throw Boom.badImplementation(
        "Erreur lors de l'appel à Notion avec les parametres suivants " +
          JSON.stringify(args)
      );
    }
  };

const getDatabaseRowsFactory =
  (
    deps = {
      client: notionClient,
    }
  ) =>
  async (databaseId: string) => {
    try {
      const rows = await deps.client.databases.query({
        database_id: databaseId,
      });

      return rows;
    } catch (error) {
      if (isNotionClientError(error)) {
        if (error?.code === APIErrorCode.ObjectNotFound) {
          throw Boom.notFound("Base de donnée Notion introuvable");
        }

        if (error?.code === APIErrorCode.Unauthorized) {
          throw Boom.unauthorized("Token Notion invalide");
        }

        if (error?.code === APIErrorCode.RateLimited) {
          throw Boom.tooManyRequests("Trop de requêtes Notion");
        }
      }

      throw Boom.badImplementation(
        "Erreur lors de la récupération des lignes de la base de donnée Notion avec l'id : " +
          databaseId
      );
    }
  };

export const getDatabaseRows = getDatabaseRowsFactory();

const getDatabaseFactory =
  (
    deps = {
      client: notionClient,
    }
  ) =>
  async (databaseId: string) => {
    try {
      return await deps.client.databases.query({
        database_id: databaseId,
      });
    } catch (error) {
      if (isNotionClientError(error)) {
        if (error?.code === APIErrorCode.ObjectNotFound) {
          throw Boom.notFound("Base de donnée Notion introuvable");
        }
      }

      throw Boom.badImplementation(
        "Erreur lors de la récupération des informations de la base de donnée Notion avec l'id : " +
          databaseId
      );
    }
  };

export const getDatabase = getDatabaseFactory();

const getPageFactory =
  (
    deps = {
      client: notionClient,
    }
  ) =>
  async (pageId: string) => {
    try {
      const page = await deps.client.pages.retrieve({
        page_id: pageId,
      });

      console.log({ page });

      return page;
    } catch (error) {
      console.error(error);
      if (isNotionClientError(error)) {
        if (error?.code === APIErrorCode.ObjectNotFound) {
          throw Boom.notFound("Page Notion introuvable");
        }

        if (error?.code === APIErrorCode.Unauthorized) {
          throw Boom.internal("Token Notion invalide");
        }
      }

      throw Boom.badImplementation(
        "Erreur lors de la récupération des informations de la page Notion avec l'id : " +
          pageId
      );
    }
  };

export const getPage = getPageFactory();

const getPageAsMarkdownFactory =
  (
    deps = {
      n2m: notionToMarkdownClient,
    }
  ) =>
  async (pageId: string): Promise<string> => {
    try {
      const mdblocks = await deps.n2m.pageToMarkdown(pageId);
      const mdString = deps.n2m.toMarkdownString(mdblocks);

      if (!mdString.hasOwnProperty("parent")) {
        return mdString.parent;
      }

      return mdString.hasOwnProperty("parent") ? mdString.parent : "";
    } catch (error) {
      if (isNotionClientError(error)) {
        if (error?.code === APIErrorCode.ObjectNotFound) {
          throw Boom.notFound("Page Notion introuvable");
        }
      }

      throw Boom.badImplementation(
        "Erreur lors de la récupération des informations de la page Notion avec l'id : " +
          pageId
      );
    }
  };

export const getPageAsMarkdown = getPageAsMarkdownFactory();

const getPagePropertiesFactory = (
  deps = {
    client: notionClient,
  }
) =>
  withNotionErrorHandling(async (pageId: string) => {
    return deps.client.pages.retrieve({ page_id: pageId });
  });

export const getPageProperties = getPagePropertiesFactory();
