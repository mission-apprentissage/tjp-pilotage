import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { beforeAll, beforeEach } from "vitest";

import config from "@/config";
import { closePgDbConnection, connectToPgDb } from "@/db/db";
import { migrateToLatest } from "@/migrations/migrate";
import { refreshViews } from "@/modules/import/usecases/refreshViews/refreshViews.usecase";
import { createdb } from "@/utils/pgtools.utils";

export const startAndConnectPg = async () => {
  const workerId = `${process.env.VITEST_POOL_ID}-${process.env.VITEST_WORKER_ID}`;

  const dbUri = config.psql.uri.replace("VITEST_POOL_ID", workerId);
  const testDb = `orion-test-${workerId}`;

  try {
    await createdb(testDb, config.psql);

    await seed(testDb);

    await connectToPgDb(dbUri);

    await migrateToLatest(true, false);
    console.log("Migration terminée");
    console.log("Rafraichissement des vues matérialisées");
    await refreshViews();
  } catch (error) {
    console.error(error);
  }
};

export const stopPg = async () => {
  await closePgDbConnection();
};

export const usePg = (clearStep: "beforeEach" | "beforeAll" = "beforeEach") => {
  beforeAll(async () => {
    await startAndConnectPg();
    if (clearStep === "beforeAll") {
      // clearAll or drop
    }

    return async () => stopPg();
  });

  beforeEach(async () => {
    if (clearStep === "beforeEach") {
      // clearAll or drop
    }
  });
};

const seed = async (dbname: string) => {
  const dir = dirname(fileURLToPath(import.meta.url));

  const execSchema = spawnSync(
    "docker",
    [
      "compose",
      "exec",
      "postgres",
      "pg_restore",
      "--username=postgres",
      `--dbname=${dbname}`,
      "--if-exists",
      "--clean",
      "--no-owner",
      "--no-acl",
      "/seed_schema.dump",
    ],
    { cwd: join(dir, "../..") }
  );

  if (execSchema.error) {
    console.error(execSchema.error);
    throw new Error("Erreur lors de la restauration de la seed : " + execSchema.error);
  }
  const execData = spawnSync(
    "docker",
    [
      "compose",
      "exec",
      "postgres",
      "pg_restore",
      "--data-only",
      "--disable-triggers",
      "--username=postgres",
      `--dbname=${dbname}`,
      "/seed_data.dump",
    ],
    { cwd: join(dir, "../..") }
  );

  if (execData.error) {
    console.error(execData.error);
    throw new Error("Erreur lors de la restauration de la seed : " + execData.error);
  }
};
