import { AxiosInstance } from "axios";

import { createAuthClient } from "./auth/auth.client";
import { createEtablissementClient } from "./etablissements/etablissements.client";
import { createFormationClient } from "./formations/formation.client";

export const createClient = (instance: AxiosInstance) => ({
  ...createFormationClient(instance),
  ...createEtablissementClient(instance),
  ...createAuthClient(instance),
});
