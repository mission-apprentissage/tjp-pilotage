import { Migrator } from "kysely";

import { kdb } from "../db/db";
import { migrations } from "./index";

const makeMigrator = () => {
  return new Migrator({
    db: kdb,
    provider: { getMigrations: async () => migrations },
  });
};

export const migrateDownDB = async () => {
  const migrator = makeMigrator();
  const { results, error } = await migrator.migrateDown();
  results?.forEach((it) => {
    if (it.status === "Success") {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === "Error") {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });
  console.log(error);
};

export async function migrateToLatest(keepAlive?: boolean) {
  const migrator = makeMigrator();

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === "Success") {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === "Error") {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (!results?.length) {
    console.log("already up to date !");
  }

  if (error) {
    console.error("failed to migrate");
    console.error(error);
    process.exit(1);
  }

  if (!keepAlive) {
    await kdb.destroy();
  }
}
