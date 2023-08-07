import { AxiosInstance } from "axios";

import { createEtablissementClient } from "./etablissements/etablissements.client";
import { createFormationClient } from "./formations/formation.client";
import { createPilotageReformeClient } from "./pilotageReforme/pilotageReforme.client";

export const createClient = (instance: AxiosInstance) => ({
  ...createFormationClient(instance),
  ...createEtablissementClient(instance),
  ...createPilotageReformeClient(instance),
});
