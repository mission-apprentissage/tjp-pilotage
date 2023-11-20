import { etablissementSchemas } from "./etablissements/etablissements.schema";
import { formationSchemas } from "./formations/formation.schema";
import { pilotageReformeSchemas } from "./pilotageReforme/pilotageReforme.schema";
import { pilotageTransformationSchemas } from "./pilotageTransfo/pilotageTransfo.schema";
import { restitutionIntentionsSchemas } from "./restitutionIntentions/restitutionIntentions.schema";

export const ROUTES_CONFIG = {
  ...formationSchemas,
  ...etablissementSchemas,
  ...pilotageReformeSchemas,
  ...pilotageTransformationSchemas,
  ...restitutionIntentionsSchemas,
};
