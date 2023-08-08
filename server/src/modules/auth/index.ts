import { Server } from "../../server";
import { authRoutes } from "./routes/auth.routes";

export const registerAuthModule = ({ server }: { server: Server }) => {
  authRoutes({ server });
};
