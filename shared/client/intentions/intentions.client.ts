import { AxiosInstance } from "axios";

import { createClientMethod } from "../clientFactory";
import { ROUTES_CONFIG } from "../ROUTES_CONFIG";

export const createIntentionsClient = (instance: AxiosInstance) => ({
  checkUai: createClientMethod<typeof ROUTES_CONFIG.checkUai>({
    method: "GET",
    url: ({ params }) => `/uai/${params.uai}/check`,
    instance,
  }),
});
