/**
 * [OBSOLETE depuis octobre 2025, UTILISER importFamillesMetiersBcn à la place]
 * Importe les familles de métiers, options BTS et années communes avec leurs spécialités associées.
 *
 * Fichiers rawData utilisés :
 * - "familleMetiers" : données des familles de métiers (FAMILLE, CFD_COMMUN, CFD_SPECIALITE, CODE_MINISTERE_TUTELLE)
 * - "optionsBTS" : données des options BTS (FAMILLE, CFD_COMMUN, CFD_SPECIALITE, CODE_MINISTERE_TUTELLE)
 *
 * Cette fonction :
 * 1. Récupère les familles de métiers depuis rawData type "familleMetiers"
 * 2. Insère ou met à jour des lignes dans la table "familleMetier" avec libellé, CFD commun, CFD spécialité et code ministère
 * 3. Récupère les options BTS depuis rawData type "optionsBTS"
 * 4. Insère ou met à jour des lignes dans la table "familleMetier" pour les options BTS
 * 5. Récupère les années communes depuis la table "familleMetier" existante (enregistrements distincts)
 * 6. Insère ou met à jour des lignes dans la table "familleMetier" pour les années communes (CFD = CFD_COMMUN)
 *
 * Retourne le nombre total de familles de métiers, options BTS et années communes importées.
 */

import { dataDI } from "@/modules/import/data.di";
import { streamIt } from "@/modules/import/utils/streamIt";

import { importFamillesMetiersDeps } from "./importFamillesMetiers.deps";

export const importFamillesMetiersFactory =
  ({
    findRawDatas = dataDI.rawDataRepository.findRawDatas,
    createFamillesMetiers = importFamillesMetiersDeps.createFamillesMetiers,
    findFamillesMetiers = importFamillesMetiersDeps.findFamillesMetiers,
  }) =>
    async () => {
      console.log(`Import des spécialité de familles de métiers`);

      let countFamillesMetier = 0;
      await streamIt(
        async (countFamillesMetier) =>
          findRawDatas({
            type: "familleMetiers",
            offset: countFamillesMetier,
            limit: 20,
          }),
        async (item) => {
          const data = {
            libelleFamille: item.FAMILLE,
            cfdFamille: item.CFD_COMMUN,
            cfd: item.CFD_SPECIALITE,
            codeMinistereTutelle: item.CODE_MINISTERE_TUTELLE,
          };

          countFamillesMetier++;
          process.stdout.write(`\r${countFamillesMetier}`);
          await createFamillesMetiers(data);
        },
        { parallel: 20 }
      );

      process.stdout.write(`\r${countFamillesMetier} familles de métiers ajoutées ou mises à jour\n\n`);

      console.log(`Import des options BTS`);

      let countOptionsBTS = 0;
      await streamIt(
        async (countOptionsBTS) =>
          findRawDatas({
            type: "optionsBTS",
            offset: countOptionsBTS,
            limit: 20,
          }),
        async (item) => {
          const data = {
            libelleFamille: item.FAMILLE,
            cfdFamille: item.CFD_COMMUN,
            cfd: item.CFD_SPECIALITE,
            codeMinistereTutelle: item.CODE_MINISTERE_TUTELLE,
          };

          countOptionsBTS++;
          process.stdout.write(`\r${countOptionsBTS}`);
          await createFamillesMetiers(data);
        },
        { parallel: 20 }
      );

      process.stdout.write(`\r${countOptionsBTS} options de BTS ajoutées ou mises à jour\n\n`);

      console.log(`Import des années communes`);

      let countOptionsAnneeCommune = 0;
      await streamIt(
        async (countOptionsAnneeCommune) =>
          findFamillesMetiers({
            offset: countOptionsAnneeCommune,
            limit: 20,
          }),

        async (familleMetier) => {
          const data = {
            libelleFamille: familleMetier.libelleFamille,
            cfdFamille: familleMetier.cfdFamille,
            cfd: familleMetier.cfdFamille,
            codeMinistereTutelle: familleMetier.codeMinistereTutelle,
          };
          countOptionsAnneeCommune++;
          process.stdout.write(`\r${countOptionsAnneeCommune}`);
          await createFamillesMetiers(data);
        },
        { parallel: 20 }
      );

      process.stdout.write(`\r${countOptionsAnneeCommune} années communes ajoutées ou mises à jour\n\n`);
    };

export const importFamillesMetiers = importFamillesMetiersFactory({});
