import { AxiosInstance } from "axios";

import { createAuthClient } from "./auth/auth.client";
import { createEtablissementClient } from "./etablissements/etablissements.client";
import { createFormationClient } from "./formations/formation.client";
import { createIntentionsClient } from "./intentions/intentions.client";
import { createPilotageReformeClient } from "./pilotageReforme/pilotageReforme.client";

export const createClient = (instance: AxiosInstance) => ({
  ...createFormationClient(instance),
  ...createEtablissementClient(instance),
  ...createPilotageReformeClient(instance),
  ...createAuthClient(instance),
  ...createIntentionsClient(instance),
});
