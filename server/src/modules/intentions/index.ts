import { Server } from "../../server";
import { countDemandesRoute } from "./usecases/countDemandes/countDemandes.route";
import { deleteDemandeRoute } from "./usecases/deleteDemande/deleteDemande.route";
import { getDemandeRoute } from "./usecases/getDemande/getDemande.route";
import { getDemandesRoute } from "./usecases/getDemandes/getDemandes.route";
import { searchDiplomeRoute } from "./usecases/searchDiplome/searchDiplome.route";
import { searchEtablissementRoute } from "./usecases/searchEtablissement/searchEtablissement.route";
import { submitDemandeRoute } from "./usecases/submitDemande/submitDemande.route";

export const registerIntentionsModule = ({ server }: { server: Server }) => {
  return {
    ...submitDemandeRoute({ server }),
    ...getDemandeRoute(server),
    ...getDemandesRoute(server),
    ...countDemandesRoute(server),
    ...deleteDemandeRoute(server),
    ...searchEtablissementRoute(server),
    ...searchDiplomeRoute(server),
  };
};
