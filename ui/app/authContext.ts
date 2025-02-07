import { createContext } from "react";
import type { UserType } from "shared/schema/userSchema";

export type Auth = {
  user: UserType;
};

export const AuthContext = createContext<{
  auth?: Auth;
  setAuth: (auth?: Auth) => void;
    }>({ setAuth: () => {} });
