import { Server, server } from "../../server";
import { coreRoutes } from "./routes/core.routes";

export const registerCoreModule = ({ server }: { server: Server }) => {
  coreRoutes({ server });
};
