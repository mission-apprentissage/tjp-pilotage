import type { Server } from "@/server/server";

import { countDemandesRoute } from "./usecases/countDemandes/countDemandes.route";
import { deleteDemandeRoute } from "./usecases/deleteDemande/deleteDemande.route";
import { deleteSuiviRoute } from "./usecases/deleteSuivi/deleteSuivi.route";
import { getDemandeRoute } from "./usecases/getDemande/getDemande.route";
import { getDemandesRoute } from "./usecases/getDemandes/getDemandes.route";
import { importDemandeRoute } from "./usecases/importDemande/importDemande.route";
import { submitDemandeRoute } from "./usecases/submitDemande/submitDemande.route";
import { submitIntentionAccessLogRoute } from "./usecases/submitIntentionAccessLog/submitIntentionAccessLog.route";
import { submitSuiviRoute } from "./usecases/submitSuivi/submitSuivi.route";

export const registerDemandesModule = (server: Server) => {
  return {
    ...submitDemandeRoute(server),
    ...getDemandeRoute(server),
    ...getDemandesRoute(server),
    ...countDemandesRoute(server),
    ...deleteDemandeRoute(server),
    ...importDemandeRoute(server),
    ...submitSuiviRoute(server),
    ...deleteSuiviRoute(server),
    ...submitIntentionAccessLogRoute(server),
  };
};
