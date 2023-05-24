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
  getFormationsForCadran: createClientMethod<
    typeof ROUTES_CONFIG.getFormationsForCadran
  >({
    method: "GET",
    url: "/cadran/formations",
    instance,
  }),
  getRegionStatsForCadran: createClientMethod<
    typeof ROUTES_CONFIG.getRegionStatsForCadran
  >({
    method: "GET",
    url: "/cadran/stats",
    instance,
  }),
  getFiltersForCadran: createClientMethod<
    typeof ROUTES_CONFIG.getFiltersForCadran
  >({
    method: "GET",
    url: "/cadran/filters",
    instance,
  }),
});
