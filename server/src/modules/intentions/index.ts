import { Server } from "../../server";
import { countDemandesRoute } from "./usecases/countDemandes/countDemandes.route";
import { deleteDemandeRoute } from "./usecases/deleteDemande/deleteDemande.route";
import { getDemandeRoute } from "./usecases/getDemande/getDemande.route";
import { getDemandesRoute } from "./usecases/getDemandes/getDemandes.route";
import { getEtabRoute } from "./usecases/getEtab/getEtab.route";
import { searchDiplomeRoute } from "./usecases/searchDiplome/searchDiplome.route";
import { searchEtabRoute } from "./usecases/searchEtab/searchEtab.route";
import { submitDemandeRoute } from "./usecases/submitDemande/submitDemande.route";

export const registerIntentionsModule = ({ server }: { server: Server }) => {
  return {
    ...submitDemandeRoute({ server }),
    ...getDemandeRoute(server),
    ...getDemandesRoute(server),
    ...countDemandesRoute(server),
    ...deleteDemandeRoute(server),
    ...getEtabRoute(server),
    ...searchEtabRoute(server),
    ...searchDiplomeRoute(server),
  };
};
