import { inject } from "injecti";

import { refreshFormationMaterializedView } from "./refreshFormationView.dep";

export const [refreshViews] = inject(
  {
    refreshFormationMaterializedView,
  },
  (deps) => {
    return async () => {
      await deps
        .refreshFormationMaterializedView()
        .then(() => console.log("Formation Views refreshed"));
    };
  }
);
