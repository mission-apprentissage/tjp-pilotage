import { createServerContext } from "react";

import { client } from "@/api.client";

export const AuthContextServer = createServerContext<{
  auth?: {
    user: (typeof client.infer)["[GET]/auth/whoAmI"]["user"];
  };
}>("authContext", {});
