import { ZodTypeProvider } from "@http-wizard/core";
import { createQueryClient } from "@http-wizard/react-query";
import axios from "axios";
import type { Router } from "server";

export const API_BASE_URL = typeof document === "undefined"
? process.env.NEXT_PUBLIC_APP_CONTAINER_URL
: process.env.NEXT_PUBLIC_SERVER_URL

export const client = createQueryClient<Router, ZodTypeProvider>({
  instance: axios.create({
    baseURL: API_BASE_URL
  }),
});
