import "dotenv/config";

import env from "env-var";
export const config = {
  PILOTAGE_POSTGRES_URI: env
    .get("PILOTAGE_POSTGRES_URI")
    .default("local")
    .asString(),
  PILOTAGE_INSERJEUNES_USERNAME: env
    .get("PILOTAGE_INSERJEUNES_USERNAME")
    .required()
    .asString(),
  PILOTAGE_INSERJEUNES_PASSWORD: env
    .get("PILOTAGE_INSERJEUNES_PASSWORD")
    .required()
    .asString(),
};
