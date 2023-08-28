import { Server } from "../../server";
import { authRoutes } from "./routes/auth.routes";
import { coreRoutes } from "./routes/core.routes";
export { extractUserInRequest } from "./utils/extractUserInRequest/extractUserInRequest";

export const registerCoreModule = ({ server }: { server: Server }) => {
  authRoutes({ server });
  coreRoutes({ server });
};

export { hasPermissionHandler } from "./utils/hasPermission";
export { shootTemplate } from "./services/mailer/mailer";
