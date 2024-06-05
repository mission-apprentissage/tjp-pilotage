import dotenv from "dotenv";
import env from "env-var";
import path from "path";
import { environments } from "shared/enum/envEnum";

if (process.env.NODE_ENV === "test") {
  dotenv.config({
    path: path.resolve(process.cwd(), `.env.test`),
  });
} else {
  dotenv.config();
}

export const config = {
  PILOTAGE_POSTGRES_URI: env
    .get("PILOTAGE_POSTGRES_URI")
    .default("local")
    .asString(),
  frontUrl: env.get("PILOTAGE_PUBLIC_URL").required().asString(),
  PILOTAGE_POSTGRES_CA: env.get("PILOTAGE_POSTGRES_CA").asString(),
  PILOTAGE_INSERJEUNES_USERNAME: env
    .get("PILOTAGE_INSERJEUNES_USERNAME")
    .required()
    .asString(),
  PILOTAGE_INSERJEUNES_PASSWORD: env
    .get("PILOTAGE_INSERJEUNES_PASSWORD")
    .required()
    .asString(),
  auth: {
    authJwtSecret: env.get("PILOTAGE_AUTH_JWT_SECRET").required().asString(),
    activationJwtSecret: env
      .get("PILOTAGE_ACTIVATION_JWT_SECRET")
      .required()
      .asString(),
    resetPasswordJwtSecret: env
      .get("PILOTAGE_RESET_PASSWORD_JWT_SECRET")
      .required()
      .asString(),
  },
  dne: {
    url: env
      .get("PILOTAGE_DNE_URL")
      .default(
        "https://hub-oidc.orion.education.fr/.well-known/openid-configuration"
      )
      .asString(),
    codeVerifierJwt: env
      .get("PILOTAGE_DNE_CODE_VERIFIER_JWT_SECRET")
      .required()
      .asString(),
    clientId: env.get("PILOTAGE_DNE_CLIENT_ID").required().asString(),
    clientSecret: env.get("PILOTAGE_DNE_CLIENT_SECRET").required().asString(),
    redirectUri: env.get("PILOTAGE_DNE_REDIRECT_URI").required().asString(),
  },
  smtp: {
    host: env.get("PILOTAGE_SMTP_HOST").required().asString(),
    port: env.get("PILOTAGE_SMTP_PORT").required().asString(),
    secure: env.get("PILOTAGE_SMTP_SECURE").asBool(),
    auth: {
      user: env.get("PILOTAGE_SMTP_AUTH_USER").asString(),
      pass: env.get("PILOTAGE_SMTP_AUTH_PASS").asString(),
    },
    email_from: env.get("PILOTAGE_EMAIL_FROM").required().asString(),
  },
  slack: {
    webhook: env.get("PILOTAGE_SLACK_WEBHOOK_URL").asString(),
    token: env.get("PILOTAGE_SLACK_TOKEN").asString(),
    signingSecret: env.get("PILOTAGE_SLACK_SIGNING_SECRET").asString(),
    chanel: env.get("PILOTAGE_SLACK_CHANEL").asString(),
  },
  host: env.get("PILOTAGE_HOST").asString(),
  gitRevision: env.get("PILOTAGE_GIT_REVISION").asString(),
  env: env.get("PILOTAGE_ENV").required().asEnum(environments),
  sql: {
    logLevel: env.get("PILOTAGE_SQL_LOG_LEVEL").asString(),
  },
  notion: {
    token: env.get("NOTION_TOKEN").required().asString(),
    dbChangelogId: env.get("NOTION_DB_CHANGELOG_ID").required().asString(),
    dbGlossaireId: env.get("NOTION_DB_GLOSSAIRE_ID").required().asString(),
  },
  s3: {
    region: env.get("PILOTAGE_S3_REGION").asString(),
    endpoint: env.get("PILOTAGE_S3_ENDPOINT").asString(),
    bucket: env.get("PILOTAGE_S3_BUCKET").asString(),
    accessKey: env.get("PILOTAGE_S3_ACCESS_KEY").asString(),
    secretKey: env.get("PILOTAGE_S3_SECRET_KEY").asString(),
  },
  sentry: {
    dsn: env.get("SENTRY_DSN").required().asString(),
    token: env.get("SENTRY_AUTH_TOKEN").required().asString(),
  },
};
