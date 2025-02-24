import * as Boom from "@hapi/boom";
import { APIErrorCode, Client, ClientErrorCode, isNotionClientError } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

import logger from "@/services/logger";

export const notionClient = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const notionToMarkdownClient = new NotionToMarkdown({
  notionClient: notionClient,
});

type CallbackFunction<K extends unknown[], T> = (...args: K) => Promise<T>;

const withNotionErrorHandling =
  <K extends unknown[], T>(callback: CallbackFunction<K, T>) =>
    async (...args: K): Promise<T> => {
      try {
        return await callback(...args);
      } catch (error) {
        if (isNotionClientError(error)) {
          switch (error.code) {
          case APIErrorCode.ObjectNotFound:
            logger.error({ ...args, error }, "[API_NOTION] Base de donnée Notion introuvable");
            throw Boom.notFound("Base de donnée Notion introuvable");
          case APIErrorCode.Unauthorized:
            logger.error({ ...args, error }, "[API_NOTION] Token Notion invalide");
            throw Boom.unauthorized("Token Notion invalide");
          case APIErrorCode.RateLimited:
            logger.error({ ...args, error }, "[API_NOTION] Trop de requêtes Notion");
            throw Boom.tooManyRequests("Trop de requêtes Notion");
          case ClientErrorCode.RequestTimeout:
          case ClientErrorCode.ResponseError:
          case APIErrorCode.RestrictedResource:
          case APIErrorCode.InvalidJSON:
          case APIErrorCode.InvalidRequestURL:
          case APIErrorCode.InvalidRequest:
          case APIErrorCode.ValidationError:
          case APIErrorCode.ConflictError:
          case APIErrorCode.InternalServerError:
          case APIErrorCode.ServiceUnavailable:
          default:
            logger.error({ ...args, error }, "[API_NOTION] Trop de requêtes Notion");
            throw Boom.badImplementation("Erreur inattendue lors de la communication avec Notion", {
              error: error as Error,
              ...args,
            });
          }
        }


        logger.error({ ...args }, "[API_NOTION] Erreur lors de l'appel à Notion avec les parametres suivants");
        throw Boom.badImplementation(
          "Erreur lors de l'appel à Notion avec les parametres suivants " + JSON.stringify(args)
        );
      }
    };

const getDatabaseRowsFactory = (
  deps = {
    client: notionClient,
  }
) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- filters type currently not exported from notion package
  withNotionErrorHandling(async (databaseId: string, filter?: any) =>
    deps.client.databases.query({
      database_id: databaseId,
      filter,
    })
  );

export const getDatabaseRows = getDatabaseRowsFactory();

const getPageFactory = (
  deps = {
    client: notionClient,
  }
) =>
  withNotionErrorHandling(async (pageId: string) =>
    deps.client.pages.retrieve({
      page_id: pageId,
    })
  );

export const getPage = getPageFactory();

const getPageAsMarkdownFactory = (
  deps = {
    n2m: notionToMarkdownClient,
  }
) =>
  withNotionErrorHandling(async (pageId: string) => {
    const mdblocks = await deps.n2m.pageToMarkdown(pageId);
    const mdString = deps.n2m.toMarkdownString(mdblocks);

    return mdString?.parent ? mdString.parent : "";
  });

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
