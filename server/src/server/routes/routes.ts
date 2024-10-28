import { registerChangelogModule } from "@/modules/changelog";
import { registerCoreModule } from "@/modules/core";
import { registerCorrectionModule } from "@/modules/corrections";
import { registerFormationModule } from "@/modules/data";
import { registerIntentionsModule } from "@/modules/demandes";
import { registerGlossaireModule } from "@/modules/glossaire";
import { registerIntentionsExpeModule } from "@/modules/intentions";
import type { Server } from "@/server/server";

export const registerRoutes = ({ server }: { server: Server }) => {
  return {
    ...registerCoreModule({ server }),
    ...registerFormationModule({ server }),
    ...registerIntentionsModule({ server }),
    ...registerIntentionsExpeModule({ server }),
    ...registerChangelogModule({ server }),
    ...registerGlossaireModule({ server }),
    ...registerCorrectionModule({ server }),
  };
};

export type Router = ReturnType<typeof registerRoutes>;
