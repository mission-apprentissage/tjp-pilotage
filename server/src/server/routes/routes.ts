import { registerCoreModule } from "@/modules/core";
import { registerCorrectionModule } from "@/modules/corrections";
import { registerDataModule } from "@/modules/data";
import { registerDemandesModule } from "@/modules/demandes";
import { registerIntentionsModule } from "@/modules/intentions";
import { registerRequetesEnregistreesModule } from "@/modules/requetesEnregistrees/index";
import type { Server } from "@/server/server";

export const registerRoutes = (server: Server) => {
  return {
    ...registerCoreModule(server),
    ...registerDataModule(server),
    ...registerDemandesModule(server),
    ...registerIntentionsModule(server),
    ...registerCorrectionModule(server),
    ...registerRequetesEnregistreesModule(server),
  };
};

export type Router = ReturnType<typeof registerRoutes>;
