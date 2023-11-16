import { Server } from "../../server";
import { panoramaRoutes } from "./routes/panorama.routes";
import { pilotageReformeRoutes } from "./routes/pilotageReforme.routes";
import { pilotageTransformationRoutes } from "./routes/pilotageTransformation.routes";
import { regionsRoutes } from "./routes/regions.routes";
import { restitutionIntentionsRoutes } from "./routes/restitutionIntentions.routes";
import { getDepartementRoute } from "./usecases/getDepartement/getDepartement.route";
import { getDepartementsRoute } from "./usecases/getDepartements/getDepartements.route";
import { getEtablissementRoute } from "./usecases/getEtablissement/etablissements.routes";
import { getEtablissementsRoutes } from "./usecases/getEtablissements/getEtablissements.routes";
import { getFormationsRoute } from "./usecases/getFormations/formations.routes";

export const registerFormationModule = ({ server }: { server: Server }) => {
  panoramaRoutes({ server });
  regionsRoutes({ server });
  pilotageReformeRoutes({ server });
  pilotageTransformationRoutes({ server });
  restitutionIntentionsRoutes({ server });

  return {
    ...getFormationsRoute({ server }),
    ...getEtablissementsRoutes({ server }),
    ...getEtablissementRoute({ server }),
    ...getDepartementRoute({ server }),
    ...getDepartementsRoute({ server }),
  };
};
