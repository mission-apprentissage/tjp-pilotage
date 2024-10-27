/* eslint-disable n/no-process-exit */
/* eslint-disable no-process-exit */
import { Migrator } from "kysely";

import { getKbdClient } from "@/db/db";

import { migrations } from "./index";

const makeMigrator = () => {
  return new Migrator({
    db: getKbdClient(),
    allowUnorderedMigrations: true,
    provider: { getMigrations: async () => migrations },
  });
};

export const migrateDownDB = async (numberOfMigrations: number) => {
  const migrator = makeMigrator();
  for (let i = 0; i < numberOfMigrations; i++) {
    const { results, error } = await migrator.migrateDown();
    results?.forEach((it) => {
      if (it.status === "Success") {
        console.log(`migration "${it.migrationName}" was executed successfully (DOWN)`);
      } else if (it.status === "Error") {
        console.error(`failed to execute migration "${it.migrationName}" (DOWN)`);
      }
    });
    if (error) {
      console.error("failed to migrate down");
      console.error(error);
      throw new Error("failed to migrate down");
    }
  }
};

export const statusMigration = async () => {
  const migrator = makeMigrator();
  const migrations = await migrator.getMigrations();
  const pendingMigrations = migrations.filter((m) => !m.executedAt);
  return pendingMigrations.length;
};

export async function migrateToLatest(keepAlive?: boolean, exitProcessInSuccess = true) {
  const migrator = makeMigrator();

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === "Success") {
      // console.log(`migration "${it.migrationName}" was executed successfully (UP)`); // a lot of log
      if (exitProcessInSuccess) process.exit(0);
    } else if (it.status === "Error") {
      console.error(`failed to execute migration "${it.migrationName}" (UP)`);
      process.exit(1);
    }
  });

  if (!results?.length) {
    console.log("already up to date !");
    if (exitProcessInSuccess) process.exit(0);
  }

  if (error) {
    console.error("failed to migrate up");
    console.error(error);
    process.exit(1);
  }

  if (!keepAlive) {
    await getKbdClient().destroy();
  }
}
