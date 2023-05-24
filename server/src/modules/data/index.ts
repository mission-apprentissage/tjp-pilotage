import { Server } from "../../server";
import { cadranRoutes } from "./routes/cadran.routes";
import { etablissementsRoutes } from "./routes/etablissements.routes";
import { formationsRoutes } from "./routes/formations.routes";

export const registerFormationModule = ({ server }: { server: Server }) => {
  formationsRoutes({ server });
  etablissementsRoutes({ server });
  cadranRoutes({ server });
};
