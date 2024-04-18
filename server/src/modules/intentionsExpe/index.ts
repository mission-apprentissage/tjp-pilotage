import { Server } from "../../server";
import { countDemandesExpeRoute } from "./usecases/countDemandesExpe/countDemandesExpe.route";
import { deleteDemandeExpeRoute } from "./usecases/deleteDemande/deleteDemandeExpe.route";
import { getCurrentCampagneRoute } from "./usecases/getDefaultCampagne/getDefaultCampagne.route";
import { getDemandeExpeRoute } from "./usecases/getDemandeExpe/getDemandeExpe.route";
import { getDemandesExpeRoute } from "./usecases/getDemandesExpe/getDemandesExpe.route";
import { importDemandeExpeRoute } from "./usecases/importDemandeExpe/importDemandeExpe.route";
import { submitDemandeExpeRoute } from "./usecases/submitDemandeExpe/submitDemandeExpe.route";

export const registerIntentionsExpeModule = ({
  server,
}: {
  server: Server;
}) => {
  return {
    ...submitDemandeExpeRoute({ server }),
    ...getDemandeExpeRoute(server),
    ...getDemandesExpeRoute(server),
    ...countDemandesExpeRoute(server),
    ...deleteDemandeExpeRoute(server),
    ...importDemandeExpeRoute(server),
    ...getCurrentCampagneRoute(server),
  };
};
