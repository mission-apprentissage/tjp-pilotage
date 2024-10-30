import { config } from "dotenv";

import { dropdb, getDefaultClient, listDatabases, setPgClientConfig } from "@/utils/pgtools.utils";

export default async () => {
  return async () => {
    const { parsed: conf } = config({ path: "./server/.env.test" });

    if (!conf) return;

    setPgClientConfig({
      host: conf.PSQL_HOST,
      user: conf.PQSL_USER,
      password: conf.PSQL_PWD,
      port: parseInt(conf.PSQL_PORT),
    });

    const pgClient = await getDefaultClient();
    if (!pgClient) return;

    try {
      if (process.env.CI) {
        return;
      }

      await pgClient.connect();
      const dbs = await listDatabases(pgClient);
      await Promise.all(
        dbs.map(async (db) => {
          if (db.startsWith("orion-test-")) {
            return dropdb(db, {}, pgClient);
          }
          return;
        })
      );
    } catch (e) {
      console.error(e);
    } finally {
      await pgClient.end();
    }
  };
};
