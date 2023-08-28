import { createContext } from "react";
import { ApiType } from "shared";

import { api } from "@/api.client";

export type Auth = { user: ApiType<typeof api.whoAmI>["user"] };

export const AuthContext = createContext<{
  auth?: Auth;
  setAuth: (auth?: Auth) => void;
}>({ setAuth: () => {} });
