import { Server } from "../../server";
import { departementsRoutes } from "./routes/departements.routes";
import { etablissementsRoutes } from "./routes/etablissements.routes";
import { formationsRoutes } from "./routes/formations.routes";
import { panoramaRoutes } from "./routes/panorama.routes"
import { pilotageReformeRoutes } from "./routes/pilotageReforme.routes";
import { regionsRoutes } from "./routes/regions.routes";

export const registerFormationModule = ({ server }: { server: Server }) => {
  formationsRoutes({ server });
  etablissementsRoutes({ server });
  panoramaRoutes({ server });
  regionsRoutes({ server });
  departementsRoutes({ server });
  pilotageReformeRoutes({ server });
};
