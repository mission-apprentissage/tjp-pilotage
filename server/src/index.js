import "dotenv/config.js";
import server from "./http/server.js";
import { logger } from "./common/logger.js";
import { connectToMongodb, configureValidation, configureIndexes } from "./common/mongodbClient.js";
import createServices from "./common/services/services.js";

process.on("unhandledRejection", (e) => logger.error(e, "An unexpected error occurred"));
process.on("uncaughtException", (e) => logger.error(e, "An unexpected error occurred"));

(async function () {
  await connectToMongodb();
  await configureIndexes();
  await configureValidation();
  const services = await createServices();

  const http = await server(services);
  http.listen(5000, () => logger.info(`Server ready and listening on port ${5000}`));
})();
