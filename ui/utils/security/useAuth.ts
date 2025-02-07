import { useContext } from "react";

import { AuthContext } from "@/app/authContext";

export const useAuth = () => useContext(AuthContext);
