import { authSchemas } from "./auth/auth.schema";
import { etablissementSchemas } from "./etablissements/etablissements.schema";
import { formationSchemas } from "./formations/formation.schema";

export const ROUTES_CONFIG = {
  ...formationSchemas,
  ...etablissementSchemas,
  ...authSchemas,
};
