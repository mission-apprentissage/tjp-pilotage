import type { Kysely } from "kysely";

import { enableDemandeConstatViewRefreshTrigger } from "./utils/triggers/demandeConstatView";
import { disableLatestDemandeViewRefreshTrigger } from "./utils/triggers/latestDemandeView";

export const up = async (_db: Kysely<unknown>) => {
  await enableDemandeConstatViewRefreshTrigger();
};

export const down = async (_db: Kysely<unknown>) => {
  await disableLatestDemandeViewRefreshTrigger();
};
