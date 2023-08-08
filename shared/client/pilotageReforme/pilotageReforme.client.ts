import { AxiosInstance } from "axios";

import { createClientMethod } from "../clientFactory";
import { ROUTES_CONFIG } from "../ROUTES_CONFIG";

export const createPilotageReformeClient = (instance: AxiosInstance) => ({
  getPilotageReformeStats: createClientMethod<
    typeof ROUTES_CONFIG.getPilotageReformeStats
  >({
    method: "GET",
    url: "/pilotage-reforme/stats",
    instance,
  }),
  getPilotageReformeStatsRegions: createClientMethod<
    typeof ROUTES_CONFIG.getPilotageReformeStatsRegions
  >({
    method: "GET",
    url: "/pilotage-reforme/stats/regions",
    instance,
  }),
});
