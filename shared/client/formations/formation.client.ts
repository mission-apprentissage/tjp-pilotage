import { AxiosInstance } from "axios";

import { createClientMethod } from "../clientFactory";
import { ROUTES_CONFIG } from "../ROUTES_CONFIG";

export const createFormationClient = (instance: AxiosInstance) => ({
  getFormations: createClientMethod<typeof ROUTES_CONFIG.getFormations>({
    method: "GET",
    url: "/formations",
    instance,
  }),
  getFormationsCsv: createClientMethod<typeof ROUTES_CONFIG.getFormationsCsv>({
    method: "GET",
    url: "/formations/csv",
    instance,
  }),
  getDataForPanorama: createClientMethod<
    typeof ROUTES_CONFIG.getDataForPanorama
  >({
    method: "GET",
    url: "/panorama/stats",
    instance,
  }),
  getRegions: createClientMethod<typeof ROUTES_CONFIG.getRegions>({
    method: "GET",
    url: "/regions",
    instance,
  }),
});
