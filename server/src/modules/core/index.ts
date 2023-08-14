import { Server } from "../../server";
import { coreRoutes } from "./routes/core.routes";
export { shootTemplate } from "./services/mailer/mailer";

export const registerCoreModule = ({ server }: { server: Server }) => {
  coreRoutes({ server });
};
