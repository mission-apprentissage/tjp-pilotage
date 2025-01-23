import axios from "axios";
import type { ZodTypeProvider } from "shared/http-wizard/core";
import type { Router } from "shared/routes/index";

import { publicConfig } from "./config.public";
import { createQueryClient } from "./http-wizard/react-query";

export const client = createQueryClient<Router, ZodTypeProvider>({
  instance: axios.create({
    baseURL: publicConfig.apiEndpoint,
    withCredentials: true,
  }),
});

export const serverClient = createQueryClient<Router, ZodTypeProvider>({
  instance: axios.create({
    // mandatory because localhost maps to ::1 (IPv6) with nodejs but api server insn't
    // mapped to ::1 but only IPv4 127.0.0.1
    baseURL: publicConfig.apiEndpoint.replace("localhost", "127.0.0.1"),
    withCredentials: true,
  }),
});
