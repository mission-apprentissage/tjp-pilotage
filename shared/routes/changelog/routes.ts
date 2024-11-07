import type { IModuleRoutesDefinition } from "../types";
import { getChangelogSchema } from "./schemas/get.changelog";

export const changelogRoutes = {
  GET: {
    "/changelog": {
      path: "/changelog",
      method: "GET",
      schema: getChangelogSchema,
    },
  },
} satisfies IModuleRoutesDefinition;
