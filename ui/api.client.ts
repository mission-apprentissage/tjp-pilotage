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
    withCredentials: true,
  }),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const serverClient = createQueryClient<any, ZodTypeProvider>({
  instance: axios.create({
    // mandatory because localhost maps to ::1 (IPv6) with nodejs but api server insn't
    // mapped to ::1 but only IPv4 127.0.0.1
    baseURL: publicConfig.apiEndpoint.replace("localhost", "127.0.0.1"),
    withCredentials: true,
  }),
});
