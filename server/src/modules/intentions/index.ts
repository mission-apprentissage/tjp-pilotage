import { Server } from "../../server";
import { countIntentionsRoute } from "./usecases/countIntentions/countIntentions.route";
import { deleteChangementStatutRoute } from "./usecases/deleteChangementStatut/deleteChangementStatut.route";
import { deleteIntentionRoute } from "./usecases/deleteIntention/deleteIntention.route";
import { getCurrentCampagneRoute } from "./usecases/getDefaultCampagne/getDefaultCampagne.route";
import { getIntentionRoute } from "./usecases/getIntention/getIntention.route";
import { getIntentionsRoute } from "./usecases/getIntentions/getIntentions.route";
import { importIntentionRoute } from "./usecases/importIntention/importIntention.route";
import { searchEtablissementPerdirRoute } from "./usecases/searchEtablissementPerdir/searchEtablissementPerdir.route";
import { submitChangementStatutRoute } from "./usecases/submitChangementStatut/submitChangementStatut.route";
import { submitIntentionRoute } from "./usecases/submitIntention/submitIntention.route";

export const registerIntentionsExpeModule = ({
  server,
}: {
  server: Server;
}) => {
  return {
    ...submitIntentionRoute({ server }),
    ...getIntentionRoute(server),
    ...getIntentionsRoute(server),
    ...countIntentionsRoute(server),
    ...deleteIntentionRoute(server),
    ...importIntentionRoute(server),
    ...getCurrentCampagneRoute(server),
    ...searchEtablissementPerdirRoute(server),
    ...submitChangementStatutRoute({ server }),
    ...deleteChangementStatutRoute(server),
  };
};
