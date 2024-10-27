import { captureException } from "@sentry/node";

import { startCLI } from "./commands";
import logger from "./services/logger";

(async function () {
  try {
    await startCLI();
  } catch (err) {
    captureException(err);
    logger.error({ err }, "startup error");
    // eslint-disable-next-line n/no-process-exit
    process.exit(1);
  }
})();
