import { AxiosInstance } from "axios";

import { createClientMethod } from "../clientFactory";
import { ROUTES_CONFIG } from "../ROUTES_CONFIG";

export const createFormationClient = (instance: AxiosInstance) => ({
  getFormations: createClientMethod<typeof ROUTES_CONFIG.getFormations>({
    method: "GET",
    url: "/formations",
    instance,
  }),
  getDataForPanoramaRegion: createClientMethod<
    typeof ROUTES_CONFIG.getDataForPanoramaRegion
  >({
    method: "GET",
    url: "/panorama/stats/region",
    instance,
  }),
  getDataForPanoramaDepartement: createClientMethod<
    typeof ROUTES_CONFIG.getDataForPanoramaDepartement
  >({
    method: "GET",
    url: "/panorama/stats/departement",
    instance,
  }),
  getRegions: createClientMethod<typeof ROUTES_CONFIG.getRegions>({
    method: "GET",
    url: "/regions",
    instance,
  }),
  getDepartements: createClientMethod<typeof ROUTES_CONFIG.getDepartements>({
    method: "GET",
    url: "/departements",
    instance,
  }),
});
