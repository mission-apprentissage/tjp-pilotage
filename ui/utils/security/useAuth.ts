import { useContext } from "react";

import { AuthContext } from "@/app/(wrapped)/auth/authContext";

export const useAuth = () => useContext(AuthContext);
