// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";

import { refreshDemandeIntentionMaterializedViews } from "./refreshDemandeIntentionViews.dep";
import { refreshFormationMaterializedViews } from "./refreshFormationView.dep";

export const [refreshViews] = inject(
  {
    refreshFormationMaterializedViews,
    refreshDemandeIntentionMaterializedViews,
  },
  (deps) => {
    return async () => {
      await deps.refreshFormationMaterializedViews().then(() => {
        console.log("formationView refreshed");
        console.log("formationScolaireView refreshed");
        console.log("formationApprentissageView refreshed");
      });

      await deps.refreshDemandeIntentionMaterializedViews().then(() => {
        console.log("latestDemandeView refreshed");
        console.log("latestIntentionView refreshed");
        console.log("demandeIntentionView refreshed");
        console.log("latestDemandeIntentionView refreshed");
      });
    };
  }
);
