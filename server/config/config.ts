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
  frontUrl: env.get("FRONT_URL").required().asString(),
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
    jwtSecret: env.get("AUTH_JWT_SECRET").required().asString(),
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
};
