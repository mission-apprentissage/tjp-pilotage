import env from "env-var";
export const config = {
  PILOTAGE_POSTGRES_URI: env
    .get("PILOTAGE_POSTGRES_URI")
    .default("local")
    .asString(),
};
