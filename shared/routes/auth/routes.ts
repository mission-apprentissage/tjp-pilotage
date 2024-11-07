import type { IModuleRoutesDefinition } from "../types";
import { checkActivationTokenSchema } from "./schemas/get.auth.checkActivationToken";
import { activateUserSchema } from "./schemas/post.auth.activate";

export const authRoutes = {
  GET: {
    "/auth/check-activation-token": {
      path: "/auth/check-activation-token",
      method: "GET",
      schema: checkActivationTokenSchema,
    },
  },
  POST: {
    "/auth/activate": {
      path: "/auth/activate",
      method: "POST",
      schema: activateUserSchema,
    },
  },
} satisfies IModuleRoutesDefinition;
