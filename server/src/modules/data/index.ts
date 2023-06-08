import { Server } from "../../server";
import { etablissementsRoutes } from "./routes/etablissements.routes";
import { formationsRoutes } from "./routes/formations.routes";
import { cadranRoutes } from "./routes/panorama.routes";
import { regionsRoutes } from "./routes/regions.routes";

export const registerFormationModule = ({ server }: { server: Server }) => {
  formationsRoutes({ server });
  etablissementsRoutes({ server });
  cadranRoutes({ server });
  regionsRoutes({ server });
};
