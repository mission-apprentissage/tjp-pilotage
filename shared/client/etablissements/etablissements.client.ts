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
  getEtablissement: createClientMethod<typeof ROUTES_CONFIG.getEtablissement>({
    method: "GET",
    url: "/etablissement",
    instance,
  }),
  getRegionStats: createClientMethod<typeof ROUTES_CONFIG.getRegionStats>({
    method: "GET",
    url: ({ params }) => `/region/${params.codeRegion}`,
    instance,
  }),
  getDepartementStats: createClientMethod<
    typeof ROUTES_CONFIG.getDepartementStats
  >({
    method: "GET",
    url: ({ params }) => `/departement/${params.codeDepartement}`,
    instance,
  }),
});
