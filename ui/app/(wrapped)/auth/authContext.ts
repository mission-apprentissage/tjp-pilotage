import { createContext } from "react";

import type { client } from "@/api.client";

export type Auth = {
  user: Exclude<(typeof client.infer)["[GET]/auth/whoAmI"], undefined>["user"];
};

export const AuthContext = createContext<{
  auth?: Auth;
  setAuth: (auth?: Auth) => void;
    }>({ setAuth: () => {} });
