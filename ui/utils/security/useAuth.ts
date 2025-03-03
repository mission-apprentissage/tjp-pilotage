import { useContext } from "react";

import { AuthContext } from "@/app/authContext";

export const useAuth = () => {
  const { auth, setAuth } = useContext(AuthContext);
  return { auth, setAuth, user: auth?.user, role: auth?.user?.role, codeRegion: auth?.user?.codeRegion };
};

