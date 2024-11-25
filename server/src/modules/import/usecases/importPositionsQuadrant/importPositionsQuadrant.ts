// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";

import { getPositionQuadrant } from "@/modules/data/services/getPositionQuadrant";
import { streamIt } from "@/modules/import/utils/streamIt";

import { findCodesNiveauDiplome } from "./steps/findCodesNiveauDiplome";
import { findFormations } from "./steps/findFormations";
import { findMillesimesSortie } from "./steps/findMillesimesSortie";
import { findRegions } from "./steps/findRegions";
import { findTauxIJ } from "./steps/findTauxIJ";
import { findTauxIJRegionaux } from "./steps/findTauxIJRegionaux";
import { findTauxRegionauxFormation } from "./steps/findTauxRegionauxFormation";
import { insertPositionFormationRegionaleQuadrant } from "./steps/insertPositionFormationRegionaleQuadrant";
import { insertTauxIJRegionaux } from "./steps/insertTauxIJRegionaux";

export const [importPositionsQuadrant, importPositionsQuadrantFactory] = inject(
  {
    findFormations: findFormations,
    findRegions: findRegions,
    findCodesNiveauDiplome: findCodesNiveauDiplome,
    findMillesimesSortie: findMillesimesSortie,
    findTauxIJ: findTauxIJ,
    insertTauxIJRegionaux: insertTauxIJRegionaux,
    findTauxRegionauxFormation: findTauxRegionauxFormation,
    findTauxIJRegionaux: findTauxIJRegionaux,
    insertPositionFormationRegionaleQuadrant: insertPositionFormationRegionaleQuadrant,
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

          if (!taux) continue;

          if (taux && taux.tauxDevenirFavorable && taux.tauxInsertion6mois && taux.tauxPoursuite) {
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
      async (count) => findFormations({ offset: count }),
      async (formation) => {
        for (const { millesimeSortie } of millesimesSortie) {
          const tauxFormation = await findTauxRegionauxFormation({
            cfd: formation.cfd,
            millesimeSortie: millesimeSortie,
            codeRegion: formation.codeRegion!,
          });

          for (const tauxUnique of tauxFormation) {
            const tauxRegionaux = await findTauxIJRegionaux({
              millesimeSortie,
              codeNiveauDiplome: formation.codeNiveauDiplome,
              codeRegion: formation.codeRegion!,
            });

            const positionQuadrant = getPositionQuadrant(
              {
                tauxInsertion: tauxUnique?.tauxInsertion6mois ?? undefined,
                tauxPoursuite: tauxUnique?.tauxPoursuite ?? undefined,
                typeFamille: formation.typeFamille,
              },
              {
                tauxInsertion: tauxRegionaux?.tauxInsertion6mois,
                tauxPoursuite: tauxRegionaux?.tauxPoursuite,
              }
            );

            await insertPositionFormationRegionaleQuadrant({
              codeRegion: formation.codeRegion!,
              cfd: formation.cfd,
              codeNiveauDiplome: formation.codeNiveauDiplome,
              millesimeSortie,
              positionQuadrant,
              moyenneInsertionCfdRegion: tauxUnique?.tauxInsertion6mois,
              moyennePoursuiteEtudeCfdRegion: tauxUnique?.tauxPoursuite,
              codeDispositif: tauxUnique?.codeDispositif,
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
