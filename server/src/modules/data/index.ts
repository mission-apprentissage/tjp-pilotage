import type { Server } from "@/server/server";

import { getAnalyseDetailleeEtablissementRoute } from "./usecases/getAnalyseDetailleeEtablissement/getAnalyseDetailleeEtablissement.route";
import { getDataForEtablissementMapRoute } from "./usecases/getDataForEtablissementMap/getDataForEtablissementMap.route";
import { getDataForEtablissementMapListRoute } from "./usecases/getDataForEtablissementMapList/getDataForEtablissementMapList.route";
import { getDataForPanoramaDepartementRoute } from "./usecases/getDataForPanoramaDepartement/getDataForPanoramaDepartement.route";
import { getDataForPanoramaRegionRoute } from "./usecases/getDataForPanoramaRegion/getDataForPanoramaRegion.route";
import { getDemandesRestitutionRoute } from "./usecases/getDemandesRestitution/getDemandesRestitution.route";
import { getDepartementRoute } from "./usecases/getDepartement/getDepartement.route";
import { getDepartementsRoute } from "./usecases/getDepartements/getDepartements.route";
import { getDomaineDeFormationRoute } from "./usecases/getDomaineDeFormation/getDomaineDeFormation.route";
import { getDomainesDeFormationRoute } from "./usecases/getDomainesDeFormation/getDomainesDeFormation.route";
import { getEtablissementRoute } from "./usecases/getEtablissement/getEtablissement.route";
import { getFormationRoute } from "./usecases/getFormation/getFormation.route";
import { getFormationCarteEtablissementsRoute } from "./usecases/getFormationCarteEtablissements/getFormationCarteEtablissements.route";
import { getFormationEtablissementsRoutes } from "./usecases/getFormationEtablissements/getFormationEtablissements.routes";
import { getFormationIndicateursRoute } from "./usecases/getFormationIndicateurs/getFormationIndicateurs.route";
import { getFormationsRoute } from "./usecases/getFormations/getFormations.route";
import {getFormationsPilotageRoute} from './usecases/getFormationsPilotage/getFormationsPilotage.route';
import { getHeaderEtablissementRoute } from "./usecases/getHeaderEtablissement/getHeaderEtablissement.route";
import { getPilotageRoute } from "./usecases/getPilotage/getPilotage.route";
import { getRegionRoute } from "./usecases/getRegion/getRegion.route";
import { getRegionsRoute } from "./usecases/getRegions/getRegions.route";
import { getStatsRestitutionRoute } from "./usecases/getStatsRestitution/getStatsRestitution.route";
import { getSuiviImpactStatsRoute } from "./usecases/getSuiviImpactStats/getSuiviImpactStats.route";
import { getSuiviImpactStatsRegionsRoute } from "./usecases/getSuiviImpactStatsRegions/getSuiviImpactStatsRegions.route";
import { searchCampusRoute } from "./usecases/searchCampus/searchCampus.route";
import { searchDiplomeRoute } from "./usecases/searchDiplome/searchDiplome.route";
import { searchDisciplineRoute } from "./usecases/searchDiscipline/searchDiscipline.route";
import { searchDomaineProfessionnelRoute } from "./usecases/searchDomaineProfessionnel/searchDomaineProfessionnel.route";
import { searchEtablissementRoute } from "./usecases/searchEtablissement/searchEtablissement.route";
import { searchFiliereRoute } from "./usecases/searchFiliere/searchFiliere.route";
import { searchMetierRoute } from "./usecases/searchMetier/searchMetier.route";
import { searchNsfRoute } from "./usecases/searchNsf/searchNsf.route";
import { searchNsfDiplomeRoute } from "./usecases/searchNsfFormation/searchNsfFormation.route";

export const registerDataModule = (server: Server) => {
  return {
    ...getFormationsRoute(server),
    ...getHeaderEtablissementRoute(server),
    ...getEtablissementRoute(server),
    ...getFormationEtablissementsRoutes(server),
    ...getDepartementRoute(server),
    ...getDepartementsRoute(server),
    ...getDataForPanoramaDepartementRoute(server),
    ...searchEtablissementRoute(server),
    ...getAnalyseDetailleeEtablissementRoute(server),
    ...getDataForPanoramaRegionRoute(server),
    ...getRegionRoute(server),
    ...getRegionsRoute(server),
    ...getPilotageRoute(server),
    ...getFormationsPilotageRoute(server),
    ...getDemandesRestitutionRoute(server),
    ...getStatsRestitutionRoute(server),
    ...getSuiviImpactStatsRoute(server),
    ...getSuiviImpactStatsRegionsRoute(server),
    ...getDataForEtablissementMapRoute(server),
    ...getDataForEtablissementMapListRoute(server),
    ...searchDiplomeRoute(server),
    ...searchNsfRoute(server),
    ...searchNsfDiplomeRoute(server),
    ...searchMetierRoute(server),
    ...searchDomaineProfessionnelRoute(server),
    ...searchDisciplineRoute(server),
    ...searchFiliereRoute(server),
    ...searchCampusRoute(server),
    ...getDomainesDeFormationRoute(server),
    ...getFormationRoute(server),
    ...getDomaineDeFormationRoute(server),
    ...getFormationIndicateursRoute(server),
    ...getFormationCarteEtablissementsRoute(server),
  };
};
