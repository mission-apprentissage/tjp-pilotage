/* eslint-disable n/no-process-exit */
/* eslint-disable no-process-exit */
import { Migrator } from "kysely";

import { getKbdClient } from "@/db/db";
import logger from "@/services/logger";

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
        logger.info(`migration "${it.migrationName}" was executed successfully (DOWN)`);
      } else if (it.status === "Error") {
        logger.error(`failed to execute migration "${it.migrationName}" (DOWN)`);
      }
    });
    if (error) {
      logger.error("failed to migrate down");
      logger.error(error);
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
      logger.info(`migration "${it.migrationName}" was executed successfully (UP)`); // a lot of log
    } else if (it.status === "Error") {
      logger.error(`failed to execute migration "${it.migrationName}" (UP)`);
    }
  });

  if (!results?.length) {
    logger.info("already up to date !");
  }

  if (error) {
    logger.error("failed to migrate up");
    logger.error(error);
    process.exit(1);
  }
}

export async function migrateToLatest(exitProcessInSuccess = true) {
  const migrator = makeMigrator();

  let remainingMigrations = await statusMigration();
  let errorInMigrations: unknown | undefined = undefined;
  let executedMigrations: number = 0;

  if (remainingMigrations === 0) {
    logger.info("already up to date !");
    if (exitProcessInSuccess) process.exit(1);
  }

  while (remainingMigrations > 0 && !errorInMigrations) {
    const { error, results } = await migrator.migrateUp();

    if (error) {
      errorInMigrations = error;
    }

    results?.forEach((it) => {
      if (it.status === "Success") {
        logger.info(`migration "${it.migrationName}" was executed successfully (UP)`); // a lot of log
        executedMigrations++;
      } else if (it.status === "Error") {
        logger.error(`failed to execute migration "${it.migrationName}" (UP)`);
      }
    });

    remainingMigrations = await statusMigration();
  }

  if (errorInMigrations) {
    logger.error("failed to migrate up");
    logger.error(errorInMigrations);

    logger.info(`Rolling back ${executedMigrations} migrations`);

    if (executedMigrations === 0) {
      logger.error("No migrations executed");
    } else {
      await migrateDownDB(executedMigrations);
    }

    process.exit(1);
  }
}
