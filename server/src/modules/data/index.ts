import { Server } from "../../server";
import { countRestitutionIntentionsStatsRoute } from "./usecases/countRestitutionIntentionsStats/countRestitutionIntentionsStats.route";
import { getDataForPanoramaDepartementRoute } from "./usecases/getDataForPanoramaDepartement/getDataForPanoramaDepartement.route";
import { getDataForPanoramaEtablissementRoute } from "./usecases/getDataForPanoramaEtablissement/getDataForPanoramaEtablissement.route";
import { getDataForPanoramaRegionRoute } from "./usecases/getDataForPanoramaRegion/getDataForPanoramaRegion.route";
import { getDepartementRoute } from "./usecases/getDepartement/getDepartement.route";
import { getDepartementsRoute } from "./usecases/getDepartements/getDepartements.route";
import { getEtablissementRoute } from "./usecases/getEtablissement/getEtablissement.route";
import { getEtablissementsRoutes } from "./usecases/getEtablissements/getEtablissements.routes";
import { getFormationsRoute } from "./usecases/getFormations/getFormations.routes";
import { getFormationsTransformationsRoute } from "./usecases/getFormationsTransformationStats/getFormationsTransformations.route";
import { getPilotageReformeStatsRoute } from "./usecases/getPilotageReformeStats/getPilotageReformeStats.route";
import { getPilotageReformeStatsRegionsRoute } from "./usecases/getPilotageReformeStatsRegions/getPilotageReformeStatsRegions.route";
import { getRegionRoute } from "./usecases/getRegion/getRegion.route";
import { getRegionsRoute } from "./usecases/getRegions/getRegions.route";
import { getRestitutionIntentionsStatsRoute } from "./usecases/getRestitutionIntentionsStats/getRestitutionIntentionStats.route";
import { getScopedTransformationStatsRoute } from "./usecases/getScopedTransformationStats/getScopedTransformationStats.route";
import { searchEtablissementRoute } from "./usecases/searchEtablissement/searchEtablissement.route";

export const registerFormationModule = ({ server }: { server: Server }) => {
  return {
    ...getFormationsRoute({ server }),
    ...getEtablissementRoute(server),
    ...getEtablissementsRoutes({ server }),
    ...getDataForPanoramaEtablissementRoute({ server }),
    ...getDepartementRoute({ server }),
    ...getDepartementsRoute({ server }),
    ...getDataForPanoramaDepartementRoute({ server }),
    ...getDataForPanoramaRegionRoute({ server }),
    ...getRegionRoute({ server }),
    ...getRegionsRoute({ server }),
    ...getFormationsTransformationsRoute({ server }),
    ...getRestitutionIntentionsStatsRoute({ server }),
    ...countRestitutionIntentionsStatsRoute({ server }),
    ...getPilotageReformeStatsRoute({ server }),
    ...searchEtablissementRoute(server),
    ...getScopedTransformationStatsRoute({ server }),
    ...getPilotageReformeStatsRegionsRoute({ server }),
  };
};
