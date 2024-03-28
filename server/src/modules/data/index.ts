import { Server } from "../../server";
import { countRestitutionIntentionsStatsRoute } from "./usecases/countRestitutionIntentionsStats/countRestitutionIntentionsStats.route";
import { getAnalyseDetailleeEtablissementRoute } from "./usecases/getAnalyseDetailleeEtablissement/getAnalyseDetailleeEtablissement.route";
import { getDataForEtablissementMapRoute } from "./usecases/getDataForEtablissementMap/getDataForEtablissementMap.route";
import { getDataForEtablissementMapListRoute } from "./usecases/getDataForEtablissementMapList/getDataForEtablissementMapList.route";
import { getDataForPanoramaDepartementRoute } from "./usecases/getDataForPanoramaDepartement/getDataForPanoramaDepartement.route";
import { getDataForPanoramaEtablissementRoute } from "./usecases/getDataForPanoramaEtablissement/getDataForPanoramaEtablissement.route";
import { getDataForPanoramaRegionRoute } from "./usecases/getDataForPanoramaRegion/getDataForPanoramaRegion.route";
import { getDepartementRoute } from "./usecases/getDepartement/getDepartement.route";
import { getDepartementsRoute } from "./usecases/getDepartements/getDepartements.route";
import { getEtablissementRoute } from "./usecases/getEtablissement/getEtablissement.route";
import { getFormationEtablissementsRoutes } from "./usecases/getFormationEtablissements/getFormationEtablissements.routes";
import { getFormationsRoute } from "./usecases/getFormations/getFormations.routes";
import { getFormationsTransformationsRoute } from "./usecases/getFormationsTransformationStats/getFormationsTransformations.route";
import { getHeaderEtablissementRoute } from "./usecases/getHeaderEtablissement/getHeaderEtablissement.route";
import { getPilotageReformeStatsRoute } from "./usecases/getPilotageReformeStats/getPilotageReformeStats.route";
import { getPilotageReformeStatsRegionsRoute } from "./usecases/getPilotageReformeStatsRegions/getPilotageReformeStatsRegions.route";
import { getRegionRoute } from "./usecases/getRegion/getRegion.route";
import { getRegionsRoute } from "./usecases/getRegions/getRegions.route";
import { getRestitutionIntentionsStatsRoute } from "./usecases/getRestitutionIntentionsStats/getRestitutionIntentionsStats.route";
import { getScopedTransformationStatsRoute } from "./usecases/getScopedTransformationStats/getScopedTransformationStats.route";
import { searchDiplomeRoute } from "./usecases/searchDiplome/searchDiplome.route";
import { searchEtablissementRoute } from "./usecases/searchEtablissement/searchEtablissement.route";

export const registerFormationModule = ({ server }: { server: Server }) => {
  return {
    ...getFormationsRoute({ server }),
    ...getHeaderEtablissementRoute({ server }),
    ...getEtablissementRoute({ server }),
    ...getFormationEtablissementsRoutes({ server }),
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
    ...getAnalyseDetailleeEtablissementRoute({ server }),
    ...getDataForEtablissementMapRoute({ server }),
    ...getDataForEtablissementMapListRoute({ server }),
    ...searchDiplomeRoute({ server }),
  };
};
