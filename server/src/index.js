import "dotenv/config";
import server from "./http/server.js";
import { logger } from "./common/logger.js";
import { connectToMongodb, configureValidation } from "./common/mongodb.js";
import createServices from "./common/services/services";

process.on("unhandledRejection", (e) => logger.error(e, "An unexpected error occurred"));
process.on("uncaughtException", (e) => logger.error(e, "An unexpected error occurred"));

(async function () {
  await connectToMongodb();
  await configureValidation();
  const services = await createServices();

  const http = await server(services);
  http.listen(5000, () => logger.info(`Server ready and listening on port ${5000}`));
})();
