import { clearAllCollections } from "../../common/mongodbClient.js";
import { logger } from "../../common/logger.js";

export const clear = async ({ clearAll }) => {
  if (clearAll) {
    await clearAllCollections();
  }
  logger.info(`Clear tjp-pilotage done`);
};
