import { startCLI } from "./commands";
import config from "./config";
import { connectToPgDb } from "./db/db";
import logger from "./services/logger";

(async function () {
  try {
    await connectToPgDb(config.psql.uri);

    await startCLI();
  } catch (err) {
    logger.error({ err }, "startup error");
    process.exit(1);
  }
})();
