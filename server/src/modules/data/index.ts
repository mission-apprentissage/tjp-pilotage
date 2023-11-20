import { Server } from "../../server";
import { pilotageReformeRoutes } from "./routes/pilotageReforme.routes";
import { pilotageTransformationRoutes } from "./routes/pilotageTransformation.routes";
import { restitutionIntentionsRoutes } from "./routes/restitutionIntentions.routes";
import { countRestitutionIntentionsStatsRoute } from "./usecases/countRestitutionIntentionsStats/countRestitutionIntentionsStats.route";
import { getDataForPanoramaDepartementRoute } from "./usecases/getDataForPanoramaDepartement/getDataForPanoramaDepartement.route";
import { getDataForPanoramaRegionRoute } from "./usecases/getDataForPanoramaRegion/getDataForPanoramaRegion.route";
import { getDepartementRoute } from "./usecases/getDepartement/getDepartement.route";
import { getDepartementsRoute } from "./usecases/getDepartements/getDepartements.route";
import { getEtablissementRoute } from "./usecases/getEtablissement/etablissements.routes";
import { getEtablissementsRoutes } from "./usecases/getEtablissements/getEtablissements.routes";
import { getFormationsRoute } from "./usecases/getFormations/formations.routes";
import { getFormationsTransformationsRoute } from "./usecases/getFormationsTransformationStats/getFormationsTransformations.route";
import { getRegionRoute } from "./usecases/getRegion/getRegion.route";
import { getRegionsRoute } from "./usecases/getRegions/getRegions.route";
import { getRestitutionIntentionsStatsRoute } from "./usecases/getRestitutionIntentionsStats/getRestitutionIntentionStats.route";
import { getTransformationsStatsRoutes } from "./usecases/getTransformationStats/getTransformationsStats.route";

export const registerFormationModule = ({ server }: { server: Server }) => {
  pilotageReformeRoutes({ server });
  pilotageTransformationRoutes({ server });
  restitutionIntentionsRoutes({ server });

  return {
    ...getFormationsRoute({ server }),
    ...getEtablissementsRoutes({ server }),
    ...getEtablissementRoute({ server }),
    ...getDepartementRoute({ server }),
    ...getDepartementsRoute({ server }),
    ...getDataForPanoramaDepartementRoute({ server }),
    ...getDataForPanoramaRegionRoute({ server }),
    ...getRegionRoute({ server }),
    ...getRegionsRoute({ server }),
    ...getFormationsTransformationsRoute({ server }),
    ...getTransformationsStatsRoutes({ server }),
    ...getRestitutionIntentionsStatsRoute({ server }),
    ...countRestitutionIntentionsStatsRoute({ server }),
  };
};
