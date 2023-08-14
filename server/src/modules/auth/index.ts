import { Server } from "../../server";
import { authRoutes } from "./routes/auth.routes";
export { extractUserInRequest } from "./utils/extractUserInRequest/extractUserInRequest";

export const registerAuthModule = ({ server }: { server: Server }) => {
  authRoutes({ server });
};

export { hasPermissionHandler } from "./utils/hasPermission";
