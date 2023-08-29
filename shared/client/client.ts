import { AxiosInstance } from "axios";

import { createAuthClient } from "./auth/auth.client";
import { createEtablissementClient } from "./etablissements/etablissements.client";
import { createFormationClient } from "./formations/formation.client";
import { createIntentionsClient } from "./intentions/intentions.client";

export const createClient = (instance: AxiosInstance) => ({
  ...createFormationClient(instance),
  ...createEtablissementClient(instance),
  ...createAuthClient(instance),
  ...createIntentionsClient(instance),
});
