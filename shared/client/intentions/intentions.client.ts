import { AxiosInstance } from "axios";

import { createClientMethod } from "../clientFactory";
import { ROUTES_CONFIG } from "../ROUTES_CONFIG";

export const createIntentionsClient = (instance: AxiosInstance) => ({
  checkUai: createClientMethod<typeof ROUTES_CONFIG.checkUai>({
    method: "GET",
    url: ({ params }) => `/uai/${params.uai}/check`,
    instance,
  }),

  checkCfd: createClientMethod<typeof ROUTES_CONFIG.checkCfd>({
    method: "GET",
    url: ({ params }) => `/cfd/${params.cfd}/check`,
    instance,
  }),
});
