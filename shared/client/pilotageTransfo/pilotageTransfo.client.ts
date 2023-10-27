import { AxiosInstance } from "axios";

import { createClientMethod } from "../clientFactory";
import { ROUTES_CONFIG } from "../ROUTES_CONFIG";

export const createPilotageTransformationClient = (
  instance: AxiosInstance
) => ({
  getTransformationStats: createClientMethod<
    typeof ROUTES_CONFIG.getTransformationStats
  >({
    method: "GET",
    url: "/pilotage-transformation/stats",
    instance,
  }),
  getFormationsTransformationStats: createClientMethod<
    typeof ROUTES_CONFIG.getFormationsTransformationStats
  >({
    method: "GET",
    url: "/pilotage-transformation/formations",
    instance,
  }),
});
