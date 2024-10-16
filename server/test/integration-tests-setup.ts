import path from "path";
import {
  DockerComposeEnvironment,
  StartedDockerComposeEnvironment,
} from "testcontainers";

import { kdb } from "../src/db/db";
import { migrateToLatest } from "../src/migrations/migrate";
import { refreshViews } from "../src/modules/import/usecases/refreshViews/refreshViews.usecase";

const postgresContainerName = "pilotage_postgres_db_test";
let dockerPostgresInstance: StartedDockerComposeEnvironment | null = null;

const seed = async () => {
  if (dockerPostgresInstance) {
    const seedSchemaFilePath = path.resolve(
      __dirname,
      "../seed/seed_schema.dump"
    );
    const seedSchemaFileContainerPath = "/seed_schema.dump";
    const seedDataFilePath = path.resolve(__dirname, "../seed/seed_data.dump");
    const seedDataFileContainerPath = "/seed_data.dump";

    console.log("Seed");
    console.log(
      "    --> Copie des seeds dans le conteneur docker " +
        postgresContainerName
    );
    await dockerPostgresInstance
      .getContainer(postgresContainerName)
      .copyFilesToContainer([
        {
          source: seedSchemaFilePath,
          target: seedSchemaFileContainerPath,
        },
        {
          source: seedDataFilePath,
          target: seedDataFileContainerPath,
        },
      ]);

    console.log("    --> Migration du schéma de la DB");
    const execSchema = await dockerPostgresInstance
      .getContainer(postgresContainerName)
      .exec([
        "pg_restore",
        "--username=postgres",
        "--dbname=postgres",
        "--if-exists",
        "--clean",
        "--verbose",
        "--no-owner",
        "--no-acl",
        seedSchemaFileContainerPath,
      ]);

    if (execSchema.exitCode !== 0) {
      console.error(execSchema.output);
      throw new Error(
        "Erreur lors de la restauration de la seed : " + execSchema.output
      );
    }

    console.log("    --> Migration des données de la DB");
    const execData = await dockerPostgresInstance
      .getContainer(postgresContainerName)
      .exec([
        "pg_restore",
        "--data-only",
        "--disable-triggers",
        "--username=postgres",
        "--dbname=postgres",
        seedDataFileContainerPath,
      ]);

    if (execData.exitCode !== 0) {
      throw new Error("Erreur lors de la restauration de la seed");
    }

    console.log("    --> Fin des migrations");
  }
};

export const spawnPostgresDb = async () => {
  const composeFilePath = path.resolve(process.cwd(), "..");
  const composeFile = "docker-compose.db.yml";

  console.log("\nDémarrage du conteneur Postgres : ", postgresContainerName);
  dockerPostgresInstance = await new DockerComposeEnvironment(
    composeFilePath,
    composeFile
  )
    .withEnvironment({
      DATABASE_PORT: "5555",
    })
    .up();
};

const isInWatchMode = () => {
  // Jest adds specific arguments when running in watch mode
  const cliArgs = process.argv.join(" ");

  return (
    (cliArgs.includes("--watch") || cliArgs.includes("--watchAll")) &&
    process.env.JEST_WORKER_ID === "1"
  );
};

export const stopPostresDb = async () => {
  if (!isInWatchMode()) {
    console.log("Destruction de la connexion à la DB");
    await kdb.destroy();

    if (dockerPostgresInstance) {
      await dockerPostgresInstance.down({ timeout: 10000 });
    }
  }
};

const setup = async () => {
  await spawnPostgresDb();
  await seed();

  console.log("Migration de la base de données");
  await migrateToLatest(true).then(async () => {
    console.log("Migration terminée");
    console.log("Rafraichissement des vues matérialisées");
    await refreshViews();
  });
};

export default setup;
