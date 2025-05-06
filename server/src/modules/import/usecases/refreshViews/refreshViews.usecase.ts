// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "@/utils/inject";

import { refreshDemandeMaterializedView } from "./refreshDemandeViews.dep";
import { refreshFormationMaterializedViews } from "./refreshFormationView.dep";

export const [refreshViews] = inject(
  {
    refreshFormationMaterializedViews,
    refreshDemandeMaterializedView,
  },
  (deps) => {
    return async () => {
      await deps.refreshFormationMaterializedViews().then(() => {
        console.log("formationView refreshed");
        console.log("formationScolaireView refreshed");
        console.log("formationApprentissageView refreshed");
      });

      await deps.refreshDemandeMaterializedView().then(() => {
        console.log("latestDemandeView refreshed");
      });
    };
  }
);
