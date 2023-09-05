import { Server } from "../../server";
import { demandeRoutes } from "./routes/demande.routes";
import { validationRoutes } from "./routes/validation.routes";

export const registerIntentionsModule = ({ server }: { server: Server }) => {
  validationRoutes({ server });
  demandeRoutes({ server });
};
