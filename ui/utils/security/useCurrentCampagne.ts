import { useContext } from "react";

import { CurrentCampagneContext } from "@/app/layoutClient";

export const useCurrentCampagne = () => useContext(CurrentCampagneContext);
