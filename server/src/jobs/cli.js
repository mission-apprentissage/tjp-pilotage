import "dotenv/config.js";
import { program as cli } from "commander";
import { migrate } from "./migrate.js";
import { seed } from "./seed/index.js";
import { clear } from "./clear/index.js";
import { runScript } from "./scriptWrapper.js";

cli
  .command("migrate")
  .description("Execute les scripts de migration")
  .option("--dropIndexes", "Supprime les anciens indexes")
  .action((options) => {
    runScript(() => {
      return migrate(options);
    });
  });

/**
 * Job d'initialisation projet
 */
cli
  .command("seed")
  .description("Seed projet")
  .requiredOption("-e, --email <string>", "Email de l'utilisateur Admin")
  .action(async ({ email }) => {
    runScript(async () => {
      return seed({ adminEmail: email.toLowerCase() });
    }, "Seed");
  });

/**
 * Job de netoyyage de db
 */
cli
  .command("clear")
  .description("Clear projet")
  .option("-a, --all", "Tout supprimer")
  .action(({ all }) => {
    runScript(async () => {
      return clear({ clearAll: all });
    }, "Clear");
  });

cli.parse(process.argv);
