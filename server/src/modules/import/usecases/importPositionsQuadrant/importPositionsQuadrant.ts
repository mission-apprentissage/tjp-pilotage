import { inject } from "injecti";

import { findCodesNiveauDiplome } from "./steps/findCodesNiveauDiplome";
import { findFormations } from "./steps/findFormations";
import { findMillesimesSortie } from "./steps/findMillesimesSortie";
import { findRegions } from "./steps/findRegions";
import { findTauxIJ } from "./steps/findTauxIJ";
import { InsertTauxIJ } from "./steps/insertTauxIJ";

export const [ImportPositionsQuadrant, ImportPositionsQuadrantFactory] = inject(
  {
    findFormations: findFormations,
    findRegions: findRegions,
    findCodesNiveauDiplome: findCodesNiveauDiplome,
    findMillesimesSortie: findMillesimesSortie,
    findTauxIJ: findTauxIJ,
    InsertTauxIJ: InsertTauxIJ,
  },
  (deps) => async () => {
    const codesRegion = await deps.findRegions();
    const codesNiveauDiplome = await deps.findCodesNiveauDiplome();
    const millesimesSortie = await deps.findMillesimesSortie();

    console.log(codesNiveauDiplome);
    console.log(millesimesSortie);

    for (const { codeRegion } of codesRegion) {
      for (const { codeNiveauDiplome } of codesNiveauDiplome) {
        for (const { millesimeSortie } of millesimesSortie) {
          const taux = await deps.findTauxIJ({
            codeRegion,
            codeNiveauDiplome,
            millesimeSortie,
          });

          if (taux) {
            await InsertTauxIJ({
              ...taux,
              codeRegion,
              codeNiveauDiplome,
              millesimeSortie,
            });
          }
        }
      }
    }

    console.log("Lieux géographiques ajoutés ou mis à jour\n");
  }
);
