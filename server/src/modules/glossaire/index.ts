import { Server } from "../../server";
import { getGlossaireRoute } from "./usecases/getGlossaire/getGlossaire.route";
import { getGlossaireEntryRoute } from "./usecases/getGlossaireEntry/getGlossaireEntry.route";

export const registerGlossaireModule = ({ server }: { server: Server }) => ({
  ...getGlossaireRoute({ server }),
  ...getGlossaireEntryRoute({ server }),
});
