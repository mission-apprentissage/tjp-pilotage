import type { Server } from "@/server/server";

import { countDemandesRoute } from "./usecases/countDemandes/countDemandes.route";
import { deleteAvisRoute } from "./usecases/deleteAvis/deleteAvis.route";
import { deleteChangementStatutRoute } from "./usecases/deleteChangementStatut/deleteChangementStatut.route";
import { deleteDemandeRoute } from "./usecases/deleteDemande/deleteDemande.route";
import { deleteDemandeFilesRoute } from "./usecases/deleteDemandeFiles/deleteDemandeFiles.route";
import { deleteSuiviRoute } from "./usecases/deleteSuivi/deleteSuivi.route";
import { getDemandeRoute } from "./usecases/getDemande/getDemande.route";
import { getDemandeFileDownloadUrlRoute } from "./usecases/getDemandeFileDownloadUrl/getDemandeFileDownloadUrl.route";
import { getDemandeFilesRoute } from "./usecases/getDemandeFiles/getDemandeFiles.route";
import { getDemandesRoute } from "./usecases/getDemandes/getDemandes.route";
import { importDemandeRoute } from "./usecases/importDemande/importDemande.route";
import { searchEtablissementPerdirRoute } from "./usecases/searchEtablissementPerdir/searchEtablissementPerdir.route";
import { submitAvisRoute } from "./usecases/submitAvis/submitAvis.route";
import { submitChangementStatutRoute } from "./usecases/submitChangementStatut/submitChangementStatut.route";
import { submitDemandeRoute } from "./usecases/submitDemande/submitDemande.route";
import { submitDemandeAccessLogRoute } from "./usecases/submitDemandeAccessLog/submitDemandeAccessLog.route";
import { submitDemandesStatutRoute } from "./usecases/submitDemandesStatut/submitDemandesStatut.route";
import { submitSuiviRoute } from "./usecases/submitSuivi/submitSuivi.route";
import { uploadDemandeFilesRoute } from "./usecases/uploadDemandeFiles/uploadDemandeFiles.route";

export const registerDemandesModule = (server: Server) => {
  return {
    ...submitDemandeRoute(server),
    ...submitDemandesStatutRoute(server),
    ...getDemandeRoute(server),
    ...getDemandesRoute(server),
    ...countDemandesRoute(server),
    ...deleteDemandeRoute(server),
    ...importDemandeRoute(server),
    ...searchEtablissementPerdirRoute(server),
    ...submitChangementStatutRoute(server),
    ...deleteChangementStatutRoute(server),
    ...submitAvisRoute(server),
    ...uploadDemandeFilesRoute(server),
    ...getDemandeFilesRoute(server),
    ...getDemandeFileDownloadUrlRoute(server),
    ...deleteDemandeFilesRoute(server),
    ...deleteAvisRoute(server),
    ...submitSuiviRoute(server),
    ...deleteSuiviRoute(server),
    ...submitDemandeAccessLogRoute(server),
  };
};
