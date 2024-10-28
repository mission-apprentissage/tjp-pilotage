import type { Dispatch, SetStateAction } from "react";
import { createContext } from "react";

import type { Campagne } from "@/app/(wrapped)/intentions/saisie/types";

export const CampagneContext = createContext<{
  campagne?: Campagne;
  setCampagne: Dispatch<SetStateAction<Campagne>>;
}>({
  campagne: undefined,
  setCampagne: () => {},
});
