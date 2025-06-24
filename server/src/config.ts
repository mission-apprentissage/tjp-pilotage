/* eslint-disable-next-line import/default */
import env from "env-var";
/* eslint-disable-next-line import/no-named-as-default-member */
const { get } = env;

const environement = get("ENV").required().asEnum(["local", "recette1", "recette2", "qualification", "production", "test"]);
const publicUrl = get("PUBLIC_URL").required().asString();

// if (process.env.NODE_ENV === "test") {
//   dotenv.config({
//     path: path.resolve(process.cwd(), `.env.test`),
//   });
// } else {
//   dotenv.config();
// }

const config = {
  productName: get("PUBLIC_PRODUCT_NAME").required().asString(),
  port: get("SERVER_PORT").required().asPortNumber(),
  version: get("PUBLIC_VERSION").required().asString(),
  env: environement,
  publicUrl,
  apiPublicUrl: environement === "local" ? "http://localhost:5001/api" : `${publicUrl}/api`,
  log: {
    type: get("LOG_TYPE").asString(),
    level: get("LOG_LEVEL").required().asString(),
    forceLocalLogs: get("LOG_LOCAL").asBool(),
  },
  psql: {
    host: get("PSQL_HOST").required().asString(),
    port: get("PSQL_PORT").required().asPortNumber(),
    user: get("PQSL_USER").required().asString(),
    password: get("PSQL_PWD").required().asString(),
    uri: get("PSQL_URI").required().asString(),
    ca: get("PSQL_CA")
      .required(environement === "production")
      .asString(),
    logLevel: get("PSQL_LOG_LEVEL").asString(),
  },
  auth: {
    authJwtSecret: get("AUTH_JWT_SECRET").required().asString(),
    activationJwtSecret: get("ACTIVATION_JWT_SECRET").required().asString(),
    resetPasswordJwtSecret: get("RESET_PASSWORD_JWT_SECRET").required().asString(),
  },
  inserJeunes: {
    username: get("INSERJEUNES_USERNAME").required().asString(),
    password: get("INSERJEUNES_PASSWORD").required().asString(),
  },
  dne: {
    codeVerifierJwt: get("DNE_CODE_VERIFIER_JWT_SECRET").required().asString(),
    clientId: get("DNE_CLIENT_ID").required().asString(),
    clientSecret: get("DNE_CLIENT_SECRET").required().asString(),
    redirectUri: get("DNE_REDIRECT_URI").required().asString(),
  },
  smtp: {
    host: get("SMTP_HOST").required().asString(),
    port: get("SMTP_PORT").required().asString(),
    auth: {
      user: get("SMTP_AUTH_USER").asString(),
      pass: get("SMTP_AUTH_PASS").asString(),
    },
    email_from: get("EMAIL_FROM").required().asString(),
  },
  slack: {
    webhook: get("SLACK_WEBHOOK_URL")
      .required(environement !== "local" && environement !== "test")
      .asString(),
    token: get("SLACK_TOKEN")
      .required(environement === "production")
      .asString(),
    signingSecret: get("SLACK_SIGNING_SECRET")
      .required(environement === "production")
      .asString(),
    channel: get("SLACK_CHANNEL")
      .required(environement !== "local" && environement !== "test")
      .asString(),
  },
  // gitRevision: get("GIT_REVISION").asString(),
  notion: {
    token: get("NOTION_TOKEN").required().asString(),
    dbChangelogId: get("NOTION_DB_CHANGELOG_ID").required().asString(),
    dbGlossaireId: get("NOTION_DB_GLOSSAIRE_ID").required().asString(),
    dbEditoId: get("NOTION_DB_EDITO_ID").required().asString(),
  },
  s3: {
    region: get("S3_REGION").asString(),
    endpoint: get("S3_ENDPOINT").asString(),
    bucket: get("S3_BUCKET").asString(),
    accessKey: get("S3_ACCESS_KEY").asString(),
    secretKey: get("S3_SECRET_KEY").asString(),
  },
  sentry: {
    dsn: get("SENTRY_DSN")
      .required(environement !== "local" && environement !== "test")
      .asString(),
    token: get("SENTRY_AUTH_TOKEN")
      .required(environement !== "local" && environement !== "test")
      .asString(),
  },
  metabase: {
    token: get("METABASE_AUTH_TOKEN")
      .required(environement !== "local" && environement !== "test")
      .asString(),
  },
  franceTravail: {
    client: get("FRANCE_TRAVAIL_CLIENT").asString(),
    secret: get("FRANCE_TRAVAIL_SECRET").asString(),
  },
};

export default config;
