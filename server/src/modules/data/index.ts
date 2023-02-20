import { Server } from "../../server";
import { formationsRoutes } from "./routes/formations.routes";

export const registerFormationModule = ({ server }: { server: Server }) => {
  formationsRoutes({ server });
};
