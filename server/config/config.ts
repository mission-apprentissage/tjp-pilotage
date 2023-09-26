import dotenv from "dotenv";
import env from "env-var";
import path from "path";

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
  slackWebhookUrl: env.get("PILOTAGE_SLACK_WEBHOOK_URL").required().asString(),
};
