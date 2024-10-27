import type { Server } from "@/server/server";

import { getAnalyseDetailleeEtablissementRoute } from "./usecases/getAnalyseDetailleeEtablissement/getAnalyseDetailleeEtablissement.route";
import { getDataForEtablissementMapRoute } from "./usecases/getDataForEtablissementMap/getDataForEtablissementMap.route";
import { getDataForEtablissementMapListRoute } from "./usecases/getDataForEtablissementMapList/getDataForEtablissementMapList.route";
import { getDataForPanoramaDepartementRoute } from "./usecases/getDataForPanoramaDepartement/getDataForPanoramaDepartement.route";
import { getDataForPanoramaEtablissementRoute } from "./usecases/getDataForPanoramaEtablissement/getDataForPanoramaEtablissement.route";
import { getDataForPanoramaRegionRoute } from "./usecases/getDataForPanoramaRegion/getDataForPanoramaRegion.route";
import { getDemandesRestitutionIntentionsRoute } from "./usecases/getDemandesRestitutionIntentions/getDemandesRestitutionIntentions.route";
import { getDepartementRoute } from "./usecases/getDepartement/getDepartement.route";
import { getDepartementsRoute } from "./usecases/getDepartements/getDepartements.route";
import { getEtablissementRoute } from "./usecases/getEtablissement/getEtablissement.route";
import { getFormationEtablissementsRoutes } from "./usecases/getFormationEtablissements/getFormationEtablissements.routes";
import { getFormationsRoute } from "./usecases/getFormations/getFormations.routes";
import { getFormationsPilotageIntentionsRoute } from "./usecases/getFormationsPilotageIntentions/getFormationsPilotageIntentions.route";
import { getHeaderEtablissementRoute } from "./usecases/getHeaderEtablissement/getHeaderEtablissement.route";
import { getPilotageReformeStatsRoute } from "./usecases/getPilotageReformeStats/getPilotageReformeStats.route";
import { getPilotageReformeStatsRegionsRoute } from "./usecases/getPilotageReformeStatsRegions/getPilotageReformeStatsRegions.route";
import { getRegionRoute } from "./usecases/getRegion/getRegion.route";
import { getRegionsRoute } from "./usecases/getRegions/getRegions.route";
import { getRepartitionPilotageIntentionsRoute } from "./usecases/getRepartitionPilotageIntentions/getRepartitionPilotageIntentions.route";
import { getStatsPilotageIntentionsRoute } from "./usecases/getStatsPilotageIntentions/getStatsPilotageIntentions.route";
import { getStatsRestitutionIntentionsRoute } from "./usecases/getStatsRestitutionIntentions/getStatsRestitutionIntentions.route";
import { searchCampusRoute } from "./usecases/searchCampus/searchCampus.route";
import { searchDiplomeRoute } from "./usecases/searchDiplome/searchDiplome.route";
import { searchDisciplineRoute } from "./usecases/searchDiscipline/searchDiscipline.route";
import { searchDomaineProfessionnelRoute } from "./usecases/searchDomaineProfessionnel/searchDomaineProfessionnel.route";
import { searchEtablissementRoute } from "./usecases/searchEtablissement/searchEtablissement.route";
import { searchFiliereRoute } from "./usecases/searchFiliere/searchFiliere.route";
import { searchMetierRoute } from "./usecases/searchMetier/searchMetier.route";
import { searchNsfRoute } from "./usecases/searchNsf/searchNsf.route";
import { searchNsfDiplomeRoute } from "./usecases/searchNsfFormation/searchNsfFormation.route";

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
    ...searchEtablissementRoute(server),
    ...getAnalyseDetailleeEtablissementRoute({ server }),
    ...getDataForPanoramaRegionRoute({ server }),
    ...getRegionRoute({ server }),
    ...getRegionsRoute({ server }),
    ...getFormationsPilotageIntentionsRoute({ server }),
    ...getStatsPilotageIntentionsRoute({ server }),
    ...getDemandesRestitutionIntentionsRoute({ server }),
    ...getStatsRestitutionIntentionsRoute({ server }),
    ...getPilotageReformeStatsRoute({ server }),
    ...getPilotageReformeStatsRegionsRoute({ server }),
    ...getDataForEtablissementMapRoute({ server }),
    ...getDataForEtablissementMapListRoute({ server }),
    ...searchDiplomeRoute({ server }),
    ...searchNsfRoute({ server }),
    ...searchNsfDiplomeRoute({ server }),
    ...searchMetierRoute({ server }),
    ...searchDomaineProfessionnelRoute({ server }),
    ...searchDisciplineRoute({ server }),
    ...searchFiliereRoute(server),
    ...searchCampusRoute(server),
    ...getRepartitionPilotageIntentionsRoute({ server }),
  };
};
