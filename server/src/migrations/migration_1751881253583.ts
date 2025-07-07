import type { Kysely } from "kysely";

import { enableDemandeConstatViewRefreshTrigger } from "./utils/triggers/demandeConstatView";
import { disableLatestDemandeViewRefreshTrigger } from "./utils/triggers/latestDemandeView";

export const up = async (db: Kysely<unknown>) => {
  await enableDemandeConstatViewRefreshTrigger();
};

export const down = async (db: Kysely<unknown>) => {
  await disableLatestDemandeViewRefreshTrigger();
};
