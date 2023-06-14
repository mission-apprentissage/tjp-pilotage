import { AxiosInstance } from "axios";

import { createClientMethod } from "../clientFactory";
import { ROUTES_CONFIG } from "../ROUTES_CONFIG";

export const createEtablissementClient = (instance: AxiosInstance) => ({
  getEtablissements: createClientMethod<typeof ROUTES_CONFIG.getEtablissements>(
    {
      method: "GET",
      url: "/etablissements",
      instance,
    }
  ),
  getEtablissementsCsv: createClientMethod<
    typeof ROUTES_CONFIG.getEtablissementsCsv
  >({
    method: "GET",
    url: "/etablissements/csv",
    instance,
  }),
  getEtablissementsList: createClientMethod<
    typeof ROUTES_CONFIG.getEtablissementsList
  >({
    method: "GET",
    url: "/etablissements/list",
    instance,
  }),
  getEtablissement: createClientMethod<typeof ROUTES_CONFIG.getEtablissement>({
    method: "GET",
    url: ({ params }) => `/etablissement/${params.uai}`,
    instance,
  }),
});
