import { authRoutes } from "./auth/routes";
import { changelogRoutes } from "./changelog/routes";
import type { IModuleRoutesDefinition } from "./types";

const GET_ROUTES = {
  ...changelogRoutes.GET,
  ...authRoutes.GET,
} satisfies IModuleRoutesDefinition["GET"];

const POST_ROUTES = {
  ...authRoutes.POST,
} satisfies IModuleRoutesDefinition["POST"];

export const API_ROUTES = {
  GET: GET_ROUTES,
  POST: POST_ROUTES,
};
