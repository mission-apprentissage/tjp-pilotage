import { Server } from "../../server";
import { FileManager } from "../core/services/fileManager/fileManager";
import { localFileManagerFactory } from "../core/services/fileManager/localFileManager";
import { FilePathManager } from "../core/services/filePathManager/filePathManager";
import { localFilePathManagerFactory } from "../core/services/filePathManager/localFilePathManager";
import { countDemandesRoute } from "./usecases/countDemandes/countDemandes.route";
import { deleteDemandeRoute } from "./usecases/deleteDemande/deleteDemande.route";
import { getCurrentCampagneRoute } from "./usecases/getDefaultCampagne/getDefaultCampagne.route";
import { getDemandeRoute } from "./usecases/getDemande/getDemande.route";
import { getDemandesRoute } from "./usecases/getDemandes/getDemandes.route";
import { importDemandeRoute } from "./usecases/importDemande/importDemande.route";
import { submitDemandeRoute } from "./usecases/submitDemande/submitDemande.route";

const fileManager: FileManager = localFileManagerFactory();
const filePathManager: FilePathManager = localFilePathManagerFactory();

export const registerIntentionsModule = ({ server }: { server: Server }) => {
  return {
    ...submitDemandeRoute(server, fileManager, filePathManager),
    ...getDemandeRoute(server),
    ...getDemandesRoute(server),
    ...countDemandesRoute(server),
    ...deleteDemandeRoute(server),
    ...importDemandeRoute(server),
    ...getCurrentCampagneRoute(server),
  };
};
