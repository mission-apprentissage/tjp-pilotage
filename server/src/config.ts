import env from "env-var";

const environement = env.get("ENV").required().asEnum(["local", "recette", "recette2", "production", "test"]);
const publicUrl = env.get("PUBLIC_URL").required().asString();

// if (process.env.NODE_ENV === "test") {
//   dotenv.config({
//     path: path.resolve(process.cwd(), `.env.test`),
//   });
// } else {
//   dotenv.config();
// }

const config = {
  productName: env.get("PUBLIC_PRODUCT_NAME").required().asString(),
  port: env.get("SERVER_PORT").required().asPortNumber(),
  version: env.get("PUBLIC_VERSION").required().asString(),
  env: environement,
  publicUrl,
  apiPublicUrl: environement === "local" ? "http://localhost:5001/api" : `${publicUrl}/api`,
  log: {
    type: env.get("LOG_TYPE").required().asString(),
    level: env.get("LOG_LEVEL").required().asString(),
  },

  PSQL_URI: env.get("PSQL_URI").default("local").asString(),
  frontUrl: env.get("PUBLIC_URL").required().asString(),
  PSQL_CA: env.get("PSQL_CA").asString(),
  INSERJEUNES_USERNAME: env.get("INSERJEUNES_USERNAME").required().asString(),
  INSERJEUNES_PASSWORD: env.get("INSERJEUNES_PASSWORD").required().asString(),

  psql: {
    host: env.get("PSQL_HOST").required().asString(),
    port: env.get("PSQL_PORT").required().asPortNumber(),
    user: env.get("PQSL_USER").required().asString(),
    password: env.get("PSQL_PWD").required().asString(),
    uri: env.get("PSQL_URI").required().asString(),
    ca: env
      .get("PSQL_CA")
      .required(environement === "production")
      .asString(),
    logLevel: env.get("PSQL_LOG_LEVEL").required().asString(),
  },
  auth: {
    authJwtSecret: env.get("AUTH_JWT_SECRET").required().asString(),
    activationJwtSecret: env.get("ACTIVATION_JWT_SECRET").required().asString(),
    resetPasswordJwtSecret: env.get("RESET_PASSWORD_JWT_SECRET").required().asString(),
  },
  dne: {
    url: env
      .get("PILOTAGE_DNE_URL")
      .default("https://hub-oidc.orion.education.fr/.well-known/openid-configuration")
      .asString(),
    codeVerifierJwt: env.get("DNE_CODE_VERIFIER_JWT_SECRET").required().asString(),
    clientId: env.get("DNE_CLIENT_ID").required().asString(),
    clientSecret: env.get("DNE_CLIENT_SECRET").required().asString(),
    redirectUri: env.get("DNE_REDIRECT_URI").required().asString(),
  },
  smtp: {
    host: env.get("SMTP_HOST").required().asString(),
    port: env.get("SMTP_PORT").required().asString(),
    secure: env.get("SMTP_SECURE").asBool(),
    auth: {
      user: env.get("SMTP_AUTH_USER").asString(),
      pass: env.get("SMTP_AUTH_PASS").asString(),
    },
    email_from: env.get("EMAIL_FROM").required().asString(),
  },
  slack: {
    webhook: env.get("SLACK_WEBHOOK_URL").asString(),
    token: env.get("SLACK_TOKEN").asString(),
    signingSecret: env.get("SLACK_SIGNING_SECRET").asString(),
    chanel: env.get("SLACK_CHANEL").asString(),
  },
  host: env.get("HOST").asString(),
  gitRevision: env.get("PILOTAGE_GIT_REVISION").asString(),

  sql: {
    logLevel: env.get("PILOTAGE_SQL_LOG_LEVEL").asString(),
  },
  notion: {
    token: env.get("NOTION_TOKEN").required().asString(),
    dbChangelogId: env.get("NOTION_DB_CHANGELOG_ID").required().asString(),
    dbGlossaireId: env.get("NOTION_DB_GLOSSAIRE_ID").required().asString(),
    dbEditoId: env.get("NOTION_DB_EDITO_ID").required().asString(),
  },
  s3: {
    region: env.get("S3_REGION").asString(),
    endpoint: env.get("S3_ENDPOINT").asString(),
    bucket: env.get("S3_BUCKET").asString(),
    accessKey: env.get("S3_ACCESS_KEY").asString(),
    secretKey: env.get("S3_SECRET_KEY").asString(),
  },
  sentry: {
    dsn: env.get("SENTRY_DSN").required().asString(),
    token: env.get("SENTRY_AUTH_TOKEN").required().asString(),
  },
  metabase: {
    token: env.get("METABASE_AUTH_TOKEN").required().asString(),
  },
  franceTravail: {
    client: env.get("FRANCE_TRAVAIL_CLIENT").asString(),
    secret: env.get("FRANCE_TRAVAIL_SECRET").asString(),
  },
};

export default config;
