import { AxiosInstance } from "axios";

import { createEtablissementClient } from "./etablissements/etablissements.client";
import { createFormationClient } from "./formations/formation.client";
import { createPilotageReformeClient } from "./pilotageReforme/pilotageReforme.client";
import { createPilotageTransformationClient } from "./pilotageTransfo/pilotageTransfo.client";
import { createRestitutionIntentionsClient } from "./restitutionIntentions/restitutionIntentions.client";

export const createClient = (instance: AxiosInstance) => ({
  ...createFormationClient(instance),
  ...createEtablissementClient(instance),
  ...createPilotageReformeClient(instance),
  ...createPilotageTransformationClient(instance),
  ...createRestitutionIntentionsClient(instance),
});
