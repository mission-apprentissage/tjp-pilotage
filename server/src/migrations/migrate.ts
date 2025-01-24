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

export async function migrateUp() {
  const migrator = makeMigrator();
  const { error, results } = await migrator.migrateUp();

  results?.forEach((it) => {
    if (it.status === "Success") {
      console.log(`migration "${it.migrationName}" was executed successfully (UP)`); // a lot of log
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
}

export async function migrateToLatest(exitProcessInSuccess = true) {
  const migrator = makeMigrator();

  let remainingMigrations = await statusMigration();
  let errorInMigrations: unknown | undefined = undefined;
  let executedMigrations: number = 0;

  if (remainingMigrations === 0) {
    console.log("already up to date !");
    if (exitProcessInSuccess) process.exit(1);
  }

  while (remainingMigrations > 0 && !errorInMigrations) {
    const { error, results } = await migrator.migrateUp();

    if (error) {
      errorInMigrations = error;
    }

    results?.forEach((it) => {
      if (it.status === "Success") {
        console.log(`migration "${it.migrationName}" was executed successfully (UP)`); // a lot of log
        executedMigrations++;
      } else if (it.status === "Error") {
        console.error(`failed to execute migration "${it.migrationName}" (UP)`);
      }
    });

    remainingMigrations = await statusMigration();
  }

  if (errorInMigrations) {
    console.error("failed to migrate up");
    console.error(errorInMigrations);

    console.log(`Rolling back ${executedMigrations} migrations`);

    if (executedMigrations === 0) {
      console.error("No migrations executed");
    } else {
      await migrateDownDB(executedMigrations);
    }

    process.exit(1);
  }
}
