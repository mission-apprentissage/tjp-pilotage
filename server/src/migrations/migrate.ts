import { Migrator } from "kysely";

import { kdb } from "../db/db";
import { migrations } from "./index";

const makeMigrator = () => {
  return new Migrator({
    db: kdb,
    allowUnorderedMigrations: true,
    provider: { getMigrations: async () => migrations },
  });
};

export const migrateDownDB = async () => {
  const migrator = makeMigrator();
  const { results, error } = await migrator.migrateDown();
  results?.forEach((it) => {
    if (it.status === "Success") {
      console.log(
        `migration "${it.migrationName}" was executed successfully (DOWN)`
      );
    } else if (it.status === "Error") {
      console.error(`failed to execute migration "${it.migrationName}" (DOWN)`);
    }
  });
  if (error) {
    console.error("failed to migrate down");
    console.error(error);
    process.exit(1);
  }
};

export async function migrateToLatest(keepAlive?: boolean) {
  const migrator = makeMigrator();

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === "Success") {
      console.log(
        `migration "${it.migrationName}" was executed successfully (UP)`
      );
    } else if (it.status === "Error") {
      console.error(`failed to execute migration "${it.migrationName}" (UP)`);
    }
  });

  if (!results?.length) {
    console.log("already up to date !");
  }

  if (error) {
    console.error("failed to migrate up");
    console.error(error);
    process.exit(1);
  }

  if (!keepAlive) {
    await kdb.destroy();
  }
}
