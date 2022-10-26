import env from "env-var";

const config = {
  appName: env.get("PILOTAGE_NAME").default("Pilotage App").asString(),
  env: env.get("PILOTAGE_ENV").default("local").asString(),
  publicUrl: env.get("PILOTAGE_PUBLIC_URL").default("http://localhost").asString(),
  auth: {
    passwordHashRounds: env.get("PILOTAGE_AUTH_PASSWORD_HASH_ROUNDS").asString(),
    user: {
      jwtSecret: env.get("PILOTAGE_AUTH_USER_JWT_SECRET").asString(),
      expiresIn: "24h",
    },
    activation: {
      jwtSecret: env.get("PILOTAGE_AUTH_ACTIVATION_JWT_SECRET").asString(),
      expiresIn: "96h",
    },
    actionToken: {
      jwtSecret: env.get("PILOTAGE__AUTH_ACTION_TOKEN_JWT_SECRET").asString(),
      expiresIn: "90 days",
    },
    resetPasswordToken: {
      jwtSecret: env.get("PILOTAGE_AUTH_PASSWORD_JWT_SECRET").asString(),
      expiresIn: "1h",
    },
    apiToken: {
      jwtSecret: env.get("PILOTAGE_AUTH_API_TOKEN_JWT_SECRET").asString(),
      expiresIn: "24h",
    },
  },
  outputDir: env.get("PILOTAGE_OUTPUT_DIR").default(".local/output").asString(),
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
  clamav: {
    uri: env.get("PILOTAGE_CLAMAV_URI").default("127.0.0.1:3310").asString(),
  },
  ovh: {
    storage: {
      encryptionKey: env.get("PILOTAGE_OVH_STORAGE_ENCRYPTION_KEY").asString(),
      uri: env.get("PILOTAGE_OVH_STORAGE_URI").asString(),
      storageName: env.get("PILOTAGE_OVH_STORAGE_NAME").default("mna-pilotage").asString(),
    },
  },
  apiEntreprise: env.get("PILOTAGE_API_ENTREPRISE_KEY").asString(),
};

export default config;
