import { Server } from "../../server";
import { countIntentionsRoute } from "./usecases/countIntentions/countIntentions.route";
import { deleteAvisRoute } from "./usecases/deleteAvis/deleteAvis.route";
import { deleteChangementStatutRoute } from "./usecases/deleteChangementStatut/deleteChangementStatut.route";
import { deleteIntentionRoute } from "./usecases/deleteIntention/deleteIntention.route";
import { deleteIntentionFilesRoute } from "./usecases/deleteIntentionFiles/deleteIntentionFiles.route";
import { deleteSuiviRoute } from "./usecases/deleteSuivi/deleteSuivi.route";
import { getCurrentCampagneRoute } from "./usecases/getDefaultCampagne/getDefaultCampagne.route";
import { getEditoRoute } from "./usecases/getEdito/getEdito.route";
import { getIntentionRoute } from "./usecases/getIntention/getIntention.route";
import { getIntentionFileDownloadUrlRoute } from "./usecases/getIntentionFileDownloadUrl/getIntentionFileDownloadUrl.route";
import { getIntentionFilesRoute } from "./usecases/getIntentionFiles/getIntentionFiles.route";
import { getIntentionsRoute } from "./usecases/getIntentions/getIntentions.route";
import { importIntentionRoute } from "./usecases/importIntention/importIntention.route";
import { searchEtablissementPerdirRoute } from "./usecases/searchEtablissementPerdir/searchEtablissementPerdir.route";
import { submitAvisRoute } from "./usecases/submitAvis/submitAvis.route";
import { submitChangementStatutRoute } from "./usecases/submitChangementStatut/submitChangementStatut.route";
import { submitIntentionRoute } from "./usecases/submitIntention/submitIntention.route";
import { submitIntentionAccessLogRoute } from "./usecases/submitIntentionAccessLog/submitIntentionAccessLog.route";
import { submitSuiviRoute } from "./usecases/submitSuivi/submitSuivi.route";
import { uploadIntentionFilesRoute } from "./usecases/uploadIntentionFiles/uploadIntentionFiles.route";

export const registerIntentionsExpeModule = (server: Server) => {
  return {
    ...submitIntentionRoute(server),
    ...getIntentionRoute(server),
    ...getIntentionsRoute(server),
    ...countIntentionsRoute(server),
    ...deleteIntentionRoute(server),
    ...importIntentionRoute(server),
    ...getCurrentCampagneRoute(server),
    ...searchEtablissementPerdirRoute(server),
    ...submitChangementStatutRoute(server),
    ...deleteChangementStatutRoute(server),
    ...submitAvisRoute(server),
    ...uploadIntentionFilesRoute(server),
    ...getIntentionFilesRoute(server),
    ...deleteIntentionFilesRoute(server),
    ...getIntentionFileDownloadUrlRoute(server),
    ...deleteAvisRoute(server),
    ...submitSuiviRoute(server),
    ...deleteSuiviRoute(server),
    ...getEditoRoute(server),
    ...submitIntentionAccessLogRoute(server),
  };
};
