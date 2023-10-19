import { AxiosInstance } from "axios";

import { createClientMethod } from "../clientFactory";
import { ROUTES_CONFIG } from "../ROUTES_CONFIG";

export const createPilotageTransformationClient = (
  instance: AxiosInstance
) => ({
  getPilotageTransformationStats: createClientMethod<
    typeof ROUTES_CONFIG.getStatsTransformation
  >({
    method: "GET",
    url: "/pilotage-transformation/stats",
    instance,
  }),
});
