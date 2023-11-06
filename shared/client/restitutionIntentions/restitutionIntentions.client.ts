import { AxiosInstance } from "axios";

import { createClientMethod } from "../clientFactory";
import { ROUTES_CONFIG } from "../ROUTES_CONFIG";

export const createRestitutionIntentionsClient = (instance: AxiosInstance) => ({
  getRestitutionIntentionsStats: createClientMethod<
    typeof ROUTES_CONFIG.getRestitutionIntentionsStats
  >({
    method: "GET",
    url: "/intentions/stats",
    instance,
  }),
  countRestitutionIntentionsStats: createClientMethod<
    typeof ROUTES_CONFIG.countRestitutionIntentionsStats
  >({
    method: "GET",
    url: "/intentions/stats/count",
    instance,
  }),
});
