import { etablissementSchemas } from "./etablissements/etablissements.schema";
import { formationSchemas } from "./formations/formation.schema";
import { pilotageReformeSchemas } from "./pilotageReforme/pilotageReforme.schema";

export const ROUTES_CONFIG = {
  ...formationSchemas,
  ...etablissementSchemas,
  ...pilotageReformeSchemas,
};
