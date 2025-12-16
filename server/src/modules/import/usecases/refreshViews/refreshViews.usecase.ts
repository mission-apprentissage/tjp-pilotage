/**
 * Rafraîchit les vues matérialisées de l'application après les imports de données.
 *
 * Vues rafraîchies :
 * - "formationView" : vue consolidée des formations
 * - "formationScolaireView" : vue des formations en voie scolaire
 * - "formationApprentissageView" : vue des formations en apprentissage
 * - "latestDemandeView" : vue des dernières demandes
 * - "demandeConstatView" : vue des demandes avec données de constatation
 *
 * Cette fonction :
 * 1. Rafraîchit les vues matérialisées de formation (scolaire, apprentissage)
 * 2. Rafraîchit la vue matérialisée des demandes
 * 3. Rafraîchit la vue matérialisée des demandes avec constatation
 * 4. Affiche la confirmation du rafraîchissement
 *
 * Retourne après rafraîchissement de toutes les vues.
 */

import { inject } from "@/utils/inject";

import { refreshDemandeConstatMaterializedView } from "./refreshDemandeConstatView.dep";
import { refreshDemandeMaterializedView } from "./refreshDemandeViews.dep";
import { refreshFormationMaterializedViews } from "./refreshFormationView.dep";

export const [refreshViews] = inject(
  {
    refreshFormationMaterializedViews,
    refreshDemandeMaterializedView,
    refreshDemandeConstatMaterializedView
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

      await deps.refreshDemandeConstatMaterializedView().then(() => {
        console.log("demandeConstatView refreshed");
      });
    };
  }
);
