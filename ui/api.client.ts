import type { ZodTypeProvider } from "@http-wizard/core";
import { createQueryClient } from "@http-wizard/react-query";
import axios from "axios";
import type { Router } from "server/src/server/routes/routes";

import { publicConfig } from "./config.public";

export const client = createQueryClient<Router, ZodTypeProvider>({
  instance: axios.create({
    baseURL: publicConfig.apiEndpoint,
    withCredentials: publicConfig.env === "local" ? false : true,
  }),
});
