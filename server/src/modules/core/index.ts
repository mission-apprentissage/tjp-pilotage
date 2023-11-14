import { Server } from "../../server";
import { authRoutes } from "./routes/auth.routes";
import { homeRoute } from "./usecases/home/home.route";
export { extractUserInRequest } from "./utils/extractUserInRequest/extractUserInRequest";

export const registerCoreModule = ({ server }: { server: Server }) => {
  authRoutes({ server });

  return {
    ...homeRoute({ server }),
  };
};

export { hasPermissionHandler } from "./utils/hasPermission";
export { shootTemplate } from "./services/mailer/mailer";
