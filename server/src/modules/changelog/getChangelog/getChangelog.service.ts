import Boom from "@hapi/boom";
import { APIErrorCode, Client, isNotionClientError } from "@notionhq/client";

export const notionClient = new Client({
  auth: process.env.NOTION_TOKEN,
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

const getDatabaseRowsFactory = (
  deps = {
    client: notionClient,
  }
) =>
  withNotionErrorHandling(async (databaseId: string) =>
    deps.client.databases.query({
      database_id: databaseId
    })
  );

export const getDatabaseRows = getDatabaseRowsFactory();
