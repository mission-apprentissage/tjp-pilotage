import type { ZodTypeProvider } from "@http-wizard/core";
import { createQueryClient } from "@http-wizard/react-query";
import axios from "axios";

// import type { Router } from "server/src/server/routes/routes";
import { publicConfig } from "./config.public";

// TODO tmp any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const client = createQueryClient<any, ZodTypeProvider>({
  instance: axios.create({
    baseURL: publicConfig.apiEndpoint,
    withCredentials: publicConfig.env === "local" ? false : true,
  }),
});
