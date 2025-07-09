import type { Kysely } from "kysely";

import type { DB } from "@/db/schema";

import { createDemandeConstatViewIndex, dropDemandeConstatViewIndex } from "./utils/indexes/demandeConstatView";
import { disableDemandeMaterializedViewsRefreshTrigger, enableDemandeMaterializedViewsRefreshTrigger } from "./utils/triggers/demande";
import { disableDemandeConstatViewRefreshTrigger, enableDemandeConstatViewRefreshTrigger } from "./utils/triggers/demandeConstatView";
import { disableLatestDemandeViewRefreshTrigger, enableLatestDemandeViewRefreshTrigger } from "./utils/triggers/latestDemandeView";

export const up = async (db: Kysely<unknown>) => {
  await disableDemandeConstatViewRefreshTrigger();
  await disableLatestDemandeViewRefreshTrigger();
  await createDemandeConstatViewIndex(db as Kysely<DB>);
  await enableDemandeMaterializedViewsRefreshTrigger();
};

export const down = async (db: Kysely<unknown>) => {
  await disableDemandeMaterializedViewsRefreshTrigger();
  await dropDemandeConstatViewIndex(db as Kysely<DB>);
  await enableLatestDemandeViewRefreshTrigger();
  await enableDemandeConstatViewRefreshTrigger();
};
