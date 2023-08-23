import { AxiosInstance } from "axios";

import { createAuthClient } from "./auth/auth.client";
import { ApiType } from "./clientFactory";
import { createEtablissementClient } from "./etablissements/etablissements.client";
import { createFormationClient } from "./formations/formation.client";
import { createIntentionsClient } from "./intentions/intentions.client";

export const createClient = (instance: AxiosInstance) => ({
  ...createFormationClient(instance),
  ...createEtablissementClient(instance),
  ...createAuthClient(instance),
  ...createIntentionsClient(instance),
});
const a = createClient({} as any);
type OO = ApiType<typeof a.checkUai>;
