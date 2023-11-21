import { ZodTypeProvider } from "@http-wizard/core";
import { createQueryClient } from "@http-wizard/react-query";
import axios from "axios";
import { Router } from "server";

export const client = createQueryClient<Router, ZodTypeProvider>({
  instance: axios.create({
    baseURL:
      typeof document === "undefined"
        ? process.env.NEXT_PUBLIC_APP_CONTAINER_URL
        : process.env.NEXT_PUBLIC_SERVER_URL,
  }),
});
