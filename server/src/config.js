import env from "env-var";

const config = {
  env: env.get("PILOTAGE_ENV").default("local").asString(),
  publicUrl: env.get("PILOTAGE_PUBLIC_URL").default("http://localhost").asString(),
  log: {
    level: env.get("PILOTAGE_LOG_LEVEL").default("info").asString(),
    format: env.get("PILOTAGE_LOG_FORMAT").default("pretty").asString(),
    destinations: env.get("PILOTAGE_LOG_DESTINATIONS").default("stdout").asArray(),
  },
  slackWebhookUrl: env.get("PILOTAGE_SLACK_WEBHOOK_URL").asString(),
  mongodb: {
    uri: env.get("PILOTAGE_MONGODB_URI").asString(),
  },
};

export default config;
