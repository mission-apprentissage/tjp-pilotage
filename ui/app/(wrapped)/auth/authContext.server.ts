import { createServerContext } from "react";
import { ApiType } from "shared";

import { api } from "@/api.client";

export const AuthContextServer = createServerContext<{
  auth?: {
    user: ApiType<typeof api.whoAmI>["user"];
  };
}>("authContext", {});
