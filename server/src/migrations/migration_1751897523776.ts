import type { Kysely } from "kysely";

import type { DB } from "@/db/schema";

import { createDemandeConstatViewIndex, dropDemandeConstatViewIndex } from "./utils/indexes/demandeConstatView";
import { enableDemandeConstatViewRefreshTrigger } from "./utils/triggers/demandeConstatView";
import { disableLatestDemandeViewRefreshTrigger } from "./utils/triggers/latestDemandeView";

export const up = async (db: Kysely<unknown>) => {
  await disableLatestDemandeViewRefreshTrigger();
  await createDemandeConstatViewIndex(db as Kysely<DB>);
  await enableDemandeConstatViewRefreshTrigger();
};

export const down = async (db: Kysely<unknown>) => {
  await disableLatestDemandeViewRefreshTrigger();
  await dropDemandeConstatViewIndex(db as Kysely<DB>);
  await enableDemandeConstatViewRefreshTrigger();
};
