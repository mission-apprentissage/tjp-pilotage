import { ZodTypeProvider } from "@http-wizard/core";
import { createQueryClient } from "@http-wizard/react-query";
import axios from "axios";
import { Router } from "server";
import { createClient } from "shared";

export const api = createClient(
  axios.create({ baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}` })
);

export const serverApi = createClient(
  axios.create({ baseURL: process.env.NEXT_PUBLIC_APP_CONTAINER_URL })
);

export const client = createQueryClient<Router, ZodTypeProvider>({
  instance: axios.create({
    baseURL:
      typeof document === "undefined"
        ? process.env.NEXT_PUBLIC_APP_CONTAINER_URL
        : process.env.NEXT_PUBLIC_SERVER_URL,
  }),
});
