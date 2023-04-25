import { etablissementSchemas } from "./etablissements/etablissements.schema";
import { formationSchemas } from "./formations/formation.schema";

export const ROUTES_CONFIG = {
  ...formationSchemas,
  ...etablissementSchemas,
};
