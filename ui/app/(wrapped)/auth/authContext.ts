import { createContext } from "react";

import { client } from "@/api.client";

export type Auth = { user: (typeof client.infer)["[GET]/auth/whoAmI"]["user"] };

export const AuthContext = createContext<{
  auth?: Auth;
  setAuth: (auth?: Auth) => void;
}>({ setAuth: () => {} });
