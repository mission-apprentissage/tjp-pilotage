import { setMaxListeners } from "node:events";

import { captureException } from "@sentry/node";
import { program } from "commander";
import HttpTerminator from "lil-http-terminator";

import { productCommands } from "./commands.product";
import config from "./config";
import { closePgDbConnection } from "./db/db";
import { migrateDownDB, migrateToLatest, statusMigration } from "./migrations/migrate";
import createServer from "./server/server";
import logger from "./services/logger";
import { closeSentry } from "./services/sentry/sentry";

program
  .configureHelp({
    sortSubcommands: true,
  })
  .hook("preAction", async (_, actionCommand) => {
    const command = actionCommand.name();
    // on définit le module du logger en global pour distinguer les logs des jobs
    if (command !== "start") {
      logger.setBindings({ module: `cli:${command}` });
    }
  })
  .hook("postAction", async () => {
    await closeSentry();
    await closePgDbConnection();

    setTimeout(() => {
      // Make sure to exit, even if we didn't close all ressources cleanly
      // eslint-disable-next-line n/no-process-exit
      process.exit(1);
    }, 60_000).unref();
  });

function createProcessExitSignal() {
  const abortController = new AbortController();

  let shutdownInProgress = false;
  ["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) => {
    (process as NodeJS.EventEmitter).on(signal, async () => {
      try {
        if (shutdownInProgress) {
          const message = `Server shut down (FORCED) (signal=${signal})`;
          logger.warn(message);
          // eslint-disable-next-line n/no-process-exit
          process.exit(1);
        }

        shutdownInProgress = true;
        logger.info(`Server is shutting down (signal=${signal})`);
        abortController.abort();
      } catch (err) {
        captureException(err);
        logger.error({ err }, "error during shutdown");
      }
    });
  });

  const signal = abortController.signal;
  setMaxListeners(100, signal);
  return signal;
}

program
  .command("start")
  .description("Démarre le serveur HTTP")
  .action(async () => {
    try {
      const signal = createProcessExitSignal();

      const server = await createServer();
      await server.listen({ port: config.port, host: "0.0.0.0" });
      logger.info(`Server ready and listening on port ${config.port}`);

      const terminator = HttpTerminator({
        server: server.server,
        maxWaitTimeout: 50_000,
        logger: logger,
      });

      if (signal.aborted) {
        await terminator.terminate();
        return;
      }

      const tasks = [
        new Promise<void>((resolve, reject) => {
          signal.addEventListener("abort", async () => {
            try {
              await terminator.terminate();
              logger.warn("Server shut down");
              resolve();
            } catch (err) {
              reject(err);
            }
          });
        }),
      ];

      await Promise.all(tasks);
    } catch (err) {
      logger.error(err);
      captureException(err);
      throw err;
    }
  });

// TODO migrateToLatest(true)
program
  .command("migrations:up")
  .description("Run migrations up")
  .action(async () => {
    await migrateToLatest();
  });

program
  .command("migrations:latest")
  .description("Run migrations latest")
  .action(async () => {
    await migrateToLatest();
  });

program
  .command("migrations:status")
  .description("Check migrations status")
  .action(async () => {
    const pendingMigrations = await statusMigration();
    console.log(`migrations-status=${pendingMigrations === 0 ? "synced" : "pending"}`);
    return;
  });

program
  .command("migrations:down")
  .description("Run migrations down")
  .argument("[numberOfMigrations]", "number of migrations to rollback [default: 1]")
  .action(async (numberOfMigrations = 1) => {
    await migrateDownDB(numberOfMigrations);
  });

productCommands(program);

export async function startCLI() {
  await program.parseAsync(process.argv);
}
