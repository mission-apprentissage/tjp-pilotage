import { checkActivationTokenSchema } from "./schemas/get.auth.check-activation-token.schema";
import { whoAmISchema } from "./schemas/get.auth.whoAmI.schema";
import { getCampagnesSchema } from "./schemas/get.campagnes.schema";
import { getChangelogSchema } from "./schemas/get.changelog.schema";
import { getCorrectionsSchema } from "./schemas/get.corrections.schema";
import { redirectDneSchema } from "./schemas/get.dne_connect.schema";
import { getDneUrlSchema } from "./schemas/get.dne_url.schema";
import { getHomeSchema } from "./schemas/get.home.schema";
import { getMaintenanceSchema } from "./schemas/get.maintenance.schema";
import { searchUserSchema } from "./schemas/get.user.search.search.schema";
import { getUsersSchema } from "./schemas/get.users.schema";
import { activateUserSchema } from "./schemas/post.auth.activate.schema";
import { loginSchema } from "./schemas/post.auth.login.schema";
import { logoutSchema } from "./schemas/post.auth.logout.schema";
import { resetPasswordSchema } from "./schemas/post.auth.reset-password.schema";
import { sendResetPasswordSchema } from "./schemas/post.auth.send-reset-password.schema";
import { createCampagneSchema } from "./schemas/post.campagnes.campagneId.schema";
import { submitCorrectionSchema } from "./schemas/post.correction.submit.schema";
import { getMetabaseDashboardUrlSchema } from "./schemas/post.generate-metabase-dashboard-url.schema";
import { createUserSchema } from "./schemas/post.users.userId.schema";
import { editCampagneSchema } from "./schemas/put.campagnes.campagneId.schema";
import { editUserSchema } from "./schemas/put.users.userId.schema";
import type { IRoutesDefinition } from "./types";

export const ROUTES = {
  "[GET]/maintenance": {
    url: "/maintenance",
    method: "GET",
    schema: getMaintenanceSchema,
  },
  "[GET]/auth/check-activation-token": {
    url: "/auth/check-activation-token",
    method: "GET",
    schema: checkActivationTokenSchema,
  },
  "[POST]/auth/activate": {
    url: "/auth/activate",
    method: "POST",
    schema: activateUserSchema,
  },
  "[POST]/auth/login": {
    url: "/auth/login",
    method: "POST",
    schema: loginSchema,
  },
  "[POST]/auth/logout": {
    url: "/auth/logout",
    method: "POST",
    schema: logoutSchema,
  },
  "[POST]/auth/send-reset-password": {
    url: "/auth/send-reset-password",
    method: "POST",
    schema: sendResetPasswordSchema,
  },
  "[POST]/auth/reset-password": {
    url: "/auth/reset-password",
    method: "POST",
    schema: resetPasswordSchema,
  },
  "[GET]/auth/whoAmI": {
    url: "/auth/whoAmI",
    method: "GET",
    schema: whoAmISchema,
  },
  "[GET]/changelog": {
    url: "/changelog",
    method: "GET",
    schema: getChangelogSchema,
  },
  "[GET]/healthcheck": {
    url: "/healthcheck",
    method: "GET",
    schema: getHomeSchema,
  },
  "[GET]/users": {
    url: "/users",
    method: "GET",
    schema: getUsersSchema,
  },
  "[POST]/users/:userId": {
    url: "/users/:userId",
    method: "POST",
    schema: createUserSchema,
  },
  "[PUT]/users/:userId": {
    url: "/users/:userId",
    method: "PUT",
    schema: editUserSchema,
  },
  "[GET]/user/search/:search": {
    url: "/user/search/:search",
    method: "GET",
    schema: searchUserSchema,
  },
  "[GET]/campagnes": {
    url: "/campagnes",
    method: "GET",
    schema: getCampagnesSchema,
  },
  "[POST]/campagnes/:campagneId": {
    url: "/campagnes/:campagneId",
    method: "POST",
    schema: createCampagneSchema,
  },
  "[PUT]/campagnes/:campagneId": {
    url: "/campagnes/:campagneId",
    method: "PUT",
    schema: editCampagneSchema,
  },
  "[POST]/generate-metabase-dashboard-url": {
    url: "/generate-metabase-dashboard-url",
    method: "PUT",
    schema: getMetabaseDashboardUrlSchema,
  },
  "[GET]/dne_url": {
    url: "/dne_url",
    method: "GET",
    schema: getDneUrlSchema,
  },
  "[GET]/dne_connect": {
    url: "dne_connect",
    method: "GET",
    schema: redirectDneSchema,
  },
  "[GET]/corrections": {
    url: "/corrections",
    method: "GET",
    schema: getCorrectionsSchema,
  },
  "[POST]/correction/submit": {
    url: "/correction/submit",
    method: "POST",
    schema: submitCorrectionSchema,
  },
} satisfies IRoutesDefinition;
