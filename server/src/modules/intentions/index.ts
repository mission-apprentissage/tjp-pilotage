import { Server } from "../../server";
import { validationRoutes } from "./routes/validation.routes";

export const registerIntentionsModule = ({ server }: { server: Server }) => {
  validationRoutes({ server });
};
