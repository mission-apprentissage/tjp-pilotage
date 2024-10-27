import type { Server } from "@/server/server";

import { getCorrectionsRoute } from "./usecases/getCorrections/getCorrections.route";
import { submitCorrectionRoute } from "./usecases/submitCorrection/submitCorrection.route";

export const registerCorrectionModule = ({ server }: { server: Server }) => {
  return {
    ...submitCorrectionRoute(server),
    ...getCorrectionsRoute(server),
  };
};
