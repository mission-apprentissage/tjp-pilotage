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
  smtp: {
    host: env.get("PILOTAGE_SMTP_HOST").asString(),
    port: env.get("PILOTAGE_SMTP_PORT").asString(),
    auth: {
      user: env.get("PILOTAGE_SMTP_AUTH_USER").asString(),
      pass: env.get("PILOTAGE_SMTP_AUTH_PASS").asString(),
    },
  },
};

export default config;
