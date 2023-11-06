import { Server } from "../../server";
import { etablissementsRoutes } from "./routes/etablissements.routes";
import { formationsRoutes } from "./routes/formations.routes";
import { cadranRoutes } from "./routes/panorama.routes";
import { pilotageReformeRoutes } from "./routes/pilotageReforme.routes";
import { pilotageTransformationRoutes } from "./routes/pilotageTransformation.routes";
import { regionsRoutes } from "./routes/regions.routes";
import { restitutionIntentionsRoutes } from "./routes/restitutionIntentions.routes";

export const registerFormationModule = ({ server }: { server: Server }) => {
  formationsRoutes({ server });
  etablissementsRoutes({ server });
  cadranRoutes({ server });
  regionsRoutes({ server });
  pilotageReformeRoutes({ server });
  pilotageTransformationRoutes({ server });
  restitutionIntentionsRoutes({ server });
};
