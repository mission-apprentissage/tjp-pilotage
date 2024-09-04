import { inject } from "injecti";

import { getPositionQuadrant } from "../../../data/services/getPositionQuadrant";
import { streamIt } from "../../utils/streamIt";
import { findCodesNiveauDiplome } from "./steps/findCodesNiveauDiplome";
import { findFormations } from "./steps/findFormations";
import { findMillesimesSortie } from "./steps/findMillesimesSortie";
import { findRegions } from "./steps/findRegions";
import { findTauxIJ } from "./steps/findTauxIJ";
import { findTauxIJRegionaux } from "./steps/findTauxIJRegionaux";
import { findTauxRegionauxFormation } from "./steps/findTauxRegionauxFormation";
import { insertPositionFormationRegionaleQuadrant } from "./steps/insertPositionFormationRegionaleQuadrant";
import { insertTauxIJRegionaux } from "./steps/insertTauxIJRegionaux";

export const [ImportPositionsQuadrant, ImportPositionsQuadrantFactory] = inject(
  {
    findFormations: findFormations,
    findRegions: findRegions,
    findCodesNiveauDiplome: findCodesNiveauDiplome,
    findMillesimesSortie: findMillesimesSortie,
    findTauxIJ: findTauxIJ,
    insertTauxIJRegionaux: insertTauxIJRegionaux,
    findTauxRegionauxFormation: findTauxRegionauxFormation,
    findTauxIJRegionaux: findTauxIJRegionaux,
    insertPositionFormationRegionaleQuadrant:
      insertPositionFormationRegionaleQuadrant,
  },
  (deps) => async () => {
    let countPositionQuadrant = 0;
    console.log(`Import des taux IJ régionaux par code niveau diplome`);

    const codesRegion = await deps.findRegions();
    const codesNiveauDiplome = await deps.findCodesNiveauDiplome();
    const millesimesSortie = await deps.findMillesimesSortie();

    for (const { codeRegion } of codesRegion) {
      for (const { codeNiveauDiplome } of codesNiveauDiplome) {
        for (const { millesimeSortie } of millesimesSortie) {
          const taux = await deps.findTauxIJ({
            codeRegion,
            codeNiveauDiplome,
            millesimeSortie,
          });

          if (
            taux &&
            taux.tauxDevenirFavorable &&
            taux.tauxInsertion6mois &&
            taux.tauxPoursuite
          ) {
            await insertTauxIJRegionaux({
              tauxInsertion6mois: taux.tauxInsertion6mois,
              tauxPoursuite: taux.tauxPoursuite,
              tauxDevenirFavorable: taux.tauxDevenirFavorable,
              codeRegion,
              codeNiveauDiplome,
              millesimeSortie,
            });
          }
        }
      }
    }

    console.log(`Import des positions quadrant`);

    await streamIt(
      (count) => findFormations({ offset: count }),
      async (formation) => {
        for (const { millesimeSortie } of millesimesSortie) {
          if (formation.formationEtablissement && formation.codeRegion) {
            const tauxFormation = await findTauxRegionauxFormation({
              cfd: formation.cfd,
              millesimeSortie: millesimeSortie,
              codeRegion: formation.codeRegion,
            });

            const tauxRegionaux = await findTauxIJRegionaux({
              millesimeSortie,
              codeNiveauDiplome: formation.codeNiveauDiplome,
              codeRegion: formation.codeRegion!,
            });

            const positionQuadrant = getPositionQuadrant(
              {
                tauxInsertion: tauxFormation?.tauxInsertion6mois ?? undefined,
                tauxPoursuite: tauxFormation?.tauxPoursuite ?? undefined,
                typeFamille: formation.typeFamille,
              },
              {
                tauxInsertion: tauxRegionaux?.tauxInsertion6mois,
                tauxPoursuite: tauxRegionaux?.tauxPoursuite,
              }
            );

            await insertPositionFormationRegionaleQuadrant({
              codeRegion: formation.codeRegion,
              cfd: formation.cfd,
              codeNiveauDiplome: formation.codeNiveauDiplome,
              millesimeSortie,
              positionQuadrant,
              moyenneInsertionCfdRegion: tauxFormation?.tauxInsertion6mois,
              moyennePoursuiteEtudeCfdRegion: tauxFormation?.tauxPoursuite,
            });
          }
        }

        countPositionQuadrant++;
        process.stdout.write(`\r${countPositionQuadrant}`);
      },
      { parallel: 5 }
    );

    console.log("\nImport des positions quadrant terminé.\n");
  }
);
