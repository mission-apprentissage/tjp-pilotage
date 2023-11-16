import { Server } from "../../server";
import { pilotageReformeRoutes } from "./routes/pilotageReforme.routes";
import { pilotageTransformationRoutes } from "./routes/pilotageTransformation.routes";
import { restitutionIntentionsRoutes } from "./routes/restitutionIntentions.routes";
import { getDataForPanoramaDepartementRoute } from "./usecases/getDataForPanoramaDepartement/getDataForPanoramaDepartement.route";
import { getDataForPanoramaRegionRoute } from "./usecases/getDataForPanoramaRegion/getDataForPanoramaRegion.route";
import { getDepartementRoute } from "./usecases/getDepartement/getDepartement.route";
import { getDepartementsRoute } from "./usecases/getDepartements/getDepartements.route";
import { getEtablissementRoute } from "./usecases/getEtablissement/etablissements.routes";
import { getEtablissementsRoutes } from "./usecases/getEtablissements/getEtablissements.routes";
import { getFormationsRoutes } from "./usecases/getFormations/formations.routes";
import { getRegionRoute } from "./usecases/getRegion/getRegion.route";
import { getRegionsRoute } from "./usecases/getRegions/getRegions.route";

export const registerFormationModule = ({ server }: { server: Server }) => {
  pilotageReformeRoutes({ server });
  pilotageTransformationRoutes({ server });
  restitutionIntentionsRoutes({ server });

  return {
    ...getFormationsRoutes({ server }),
    ...getEtablissementsRoutes({ server }),
    ...getEtablissementRoute({ server }),
    ...getDepartementRoute({ server }),
    ...getDepartementsRoute({ server }),
    ...getDataForPanoramaDepartementRoute({ server }),
    ...getDataForPanoramaRegionRoute({ server }),
    ...getRegionRoute({ server }),
    ...getRegionsRoute({ server }),
  };
};
