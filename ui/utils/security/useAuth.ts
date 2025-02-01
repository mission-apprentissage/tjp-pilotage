import { useContext } from "react";

import { AuthContext } from "@/app/context/authContext";


export const useAuth = () => useContext(AuthContext);
