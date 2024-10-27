import type { ZodTypeProvider } from "@http-wizard/core";
import { createQueryClient } from "@http-wizard/react-query";
import axios from "axios";

// import type { Router } from "server/src/server/routes";
import { publicConfig } from "./config.public";

// export const API_BASE_URL =
//   typeof document === "undefined" ? process.env.NEXT_PUBLIC_APP_CONTAINER_URL : process.env.NEXT_PUBLIC_SERVER_URL;

// TODO TEMPARY ANY
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const client = createQueryClient<any, ZodTypeProvider>({
  instance: axios.create({
    baseURL: publicConfig.apiEndpoint,
    withCredentials: publicConfig.env === "local" ? false : true,
  }),
});
