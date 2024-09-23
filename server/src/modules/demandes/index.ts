import { Server } from "../../server";
import { countDemandesRoute } from "./usecases/countDemandes/countDemandes.route";
import { deleteDemandeRoute } from "./usecases/deleteDemande/deleteDemande.route";
import { getCurrentCampagneRoute } from "./usecases/getDefaultCampagne/getDefaultCampagne.route";
import { getDemandeRoute } from "./usecases/getDemande/getDemande.route";
import { getDemandesRoute } from "./usecases/getDemandes/getDemandes.route";
import { importDemandeRoute } from "./usecases/importDemande/importDemande.route";
import { submitDemandeRoute } from "./usecases/submitDemande/submitDemande.route";

export const registerIntentionsModule = ({ server }: { server: Server }) => {
  return {
    ...submitDemandeRoute({ server }),
    ...getDemandeRoute(server),
    ...getDemandesRoute(server),
    ...countDemandesRoute(server),
    ...deleteDemandeRoute(server),
    ...importDemandeRoute(server),
    ...getCurrentCampagneRoute(server),
  };
};
