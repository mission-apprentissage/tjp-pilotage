import { AxiosInstance } from "axios";

import { createClientMethod } from "../clientFactory";
import { ROUTES_CONFIG } from "../ROUTES_CONFIG";

export const createAuthClient = (instance: AxiosInstance) => ({
  login: createClientMethod<typeof ROUTES_CONFIG.login>({
    method: "POST",
    url: "/auth/login",
    instance,
  }),
  logout: createClientMethod<typeof ROUTES_CONFIG.logout>({
    method: "POST",
    url: "/auth/logout",
    instance,
  }),
  whoAmI: createClientMethod<typeof ROUTES_CONFIG.whoAmI>({
    method: "GET",
    url: "/auth/whoAmI",
    instance,
  }),
  activateUser: createClientMethod<typeof ROUTES_CONFIG.activateUser>({
    method: "POST",
    url: "/auth/activate",
    instance,
  }),
});
