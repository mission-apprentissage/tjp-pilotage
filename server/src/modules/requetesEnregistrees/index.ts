import type { Server } from "@/server/server";

import { deleteRequeteEnregistreeRoute } from "./usecases/deleteRequeteEnregistree/deleteRequeteEnregistree.route";
import { getRequetesEnregistreesRoute } from "./usecases/getRequetesEnregistrees/getRequetesEnregistrees.route";
import { submitRequeteEnregistreeRoute } from "./usecases/submitRequeteEnregistree/submitRequeteEnregistree.route";

export const registerRequetesEnregistreesModule = (server: Server) => {
  return {
    ...getRequetesEnregistreesRoute(server),
    ...submitRequeteEnregistreeRoute(server),
    ...deleteRequeteEnregistreeRoute(server),
  };
};
