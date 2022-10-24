import {
  connectToMongodb,
  closeMongodbConnection,
  configureIndexes,
  configureValidation,
} from "../common/mongodbClient.js";
import { DateTime } from "luxon";
import createServices from "../common/services/services.js";
import config from "../config.js";
import { access, mkdir } from "fs/promises";
import { logger } from "../common/logger.js";
import { isEmpty } from "lodash-es";

process.on("unhandledRejection", (e) => console.log(e));
process.on("uncaughtException", (e) => console.log(e));

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const createTimer = () => {
  let launchTime;
  return {
    start: () => {
      launchTime = DateTime.now();
    },
    stop: (results) => {
      const duration = DateTime.now().diff(launchTime).toFormat("hh:mm:ss:SSS");
      const data = results && results.toJSON ? results.toJSON() : results;
      if (!isEmpty(data)) {
        logger.info(JSON.stringify(data, null, 2));
      }
      logger.info(`Completed in ${duration}`);
    },
  };
};

const ensureOutputDirExists = async () => {
  const outputDir = config.outputDir;
  try {
    await access(outputDir);
  } catch (e) {
    if (e.code !== "EEXIST") {
      await mkdir(outputDir, { recursive: true });
    }
  }
  return outputDir;
};

/**
 * Fonction de sortie du script
 * @param {*} rawError
 */
const exit = async (rawError) => {
  let error = rawError;
  if (rawError) {
    logger.error(rawError.constructor.name === "EnvVarError" ? rawError.message : rawError);
  }

  //Waiting logger to flush all logs (MongoDB)
  await timeout(250);

  try {
    await closeMongodbConnection();
  } catch (closeError) {
    error = closeError;
    console.error(error);
  }

  process.exitCode = error ? 1 : 0;
};

/**
 * Wrapper pour l'execution de scripts
 * @param {*} job
 * @param {*} jobName
 */
// TODO jobName
// eslint-disable-next-line no-unused-vars
export const runScript = async (job, jobName) => {
  const timer = createTimer();
  timer.start();

  await ensureOutputDirExists();
  // Start db connection & services injection
  await connectToMongodb();
  await configureIndexes();
  await configureValidation();
  const services = await createServices();

  // TODO await services.jobEvents.createJobEvent({ jobname: jobName, action: JOB_STATUS.started });

  try {
    const results = await job(services);
    // TODO await services.jobEvents.createJobEvent({
    //   jobname: jobName,
    //   action: JOB_STATUS.executed,
    //   data: { startDate, endDate, duration },
    // });
    timer.stop(results);

    await exit();
  } catch (e) {
    await exit(e);
  } finally {
    // TODO await services.jobEvents.createJobEvent({ jobname: jobName, action: JOB_STATUS.ended, date: new Date() });
  }
};
