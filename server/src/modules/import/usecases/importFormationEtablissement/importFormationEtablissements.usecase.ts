// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";
import { MILLESIMES_IJ, RENTREES_SCOLAIRES, VoieEnum } from "shared";

import { rawDataRepository } from "@/modules/import/repositories/rawData.repository";
import { getCfdDispositifs } from "@/modules/import/usecases/getCfdRentrees/getCfdDispositifs.dep";
import { getCfdRentrees } from "@/modules/import/usecases/getCfdRentrees/getCfdRentrees.usecase";
import { countDiplomesProfessionnels } from "@/modules/import/usecases/importIJData/countDiplomesProfessionnels.dep";
import { countFamillesMetiers } from "@/modules/import/usecases/importIJData/countFamillesMetiers.dep";
import { findDiplomesProfessionnels } from "@/modules/import/usecases/importIJData/findDiplomesProfessionnels.dep";
import { streamIt } from "@/modules/import/utils/streamIt";

import { deleteFormationEtablissement } from "./deleteFormationEtablissement";
import { findDataFormation } from "./findDataFormation.dep";
import { findFamillesMetiers } from "./findFamillesMetiers.dep";
import { findFormationEtablissement } from "./findFormationEtablissement";
import { findUAIsApprentissage } from "./findUAIsApprentissage";
import { importEtablissement } from "./steps/importEtablissement/importEtablissement.step";
import { importFormation } from "./steps/importFormation/importFormation.step";
import { importFormationHistorique } from "./steps/importFormationsHistoriques/importFormationsHistoriques.step";
import { createFormationEtablissement } from "./steps/importIndicateurEtablissement/createFormationEtablissement.dep";
import { importIndicateurEtablissement } from "./steps/importIndicateurEtablissement/importIndicateurEtablissement.step";
import { importIndicateurEntree } from "./steps/importIndicateursEntree/importIndicateursEntree.step";
import {
  importIndicateurSortie,
  importIndicateurSortieApprentissage,
} from "./steps/importIndicateursSortie/importIndicateursSortie.step";
import {
  importIndicateursRegionSortie,
  importIndicateursRegionSortieApprentissage,
} from "./steps/importIndicateursSortieRegionaux/importIndicateursSortieRegionaux.step";
import { extractCfdFromMefAndDuree, extractYearFromTags, isYearBetweenOuvertureAndFermeture } from "./utils";

const processedUais = new Set<string>();

export const [importFormations] = inject(
  {
    importFormation,
    importFormationHistorique,
    findDiplomesProfessionnels,
    findFamillesMetiers,
    countDiplomesProfessionnels,
    countFamillesMetiers
  },
  (deps) => {
    return async () => {
      const { nbDiplomesProfessionnels } = await deps.countDiplomesProfessionnels();
      const { nbFamillesMetiers } = await deps.countFamillesMetiers();
      const total = nbDiplomesProfessionnels + nbFamillesMetiers;
      let nbDiplomesProfessionnelsDone = 0;

      console.log(`Début de l'import des données sur les ${total} formations`);

      await streamIt(
        (count) => deps.findDiplomesProfessionnels({ offset: count, limit: 60 }),
        async (item, count) => {
          const cfd = item.cfd;
          const voie = item.voie;
          console.log("--", "cfd", `(${voie})`, cfd, `-- ${Math.round(count/total * 10000)/100}%`);
          if (!cfd) return;
          const ancienCfds = await deps.importFormationHistorique({
            cfd,
            voie,
          });
          for (const ancienCfd of ancienCfds ?? []) {
            await importFormationEtablissements({ cfd: ancienCfd, voie });
          }
          await importFormationEtablissements({ cfd, voie });
          nbDiplomesProfessionnelsDone++;
        },
        { parallel: 20 }
      );

      await streamIt(
        (count) => deps.findFamillesMetiers({ offset: count, limit: 60 }),
        async (item, count) => {
          const cfd = item.cfd;
          console.log("--", "cfd famille", cfd, `-- (${Math.round((count+nbDiplomesProfessionnelsDone)/total * 10000)/100}%)`);
          if (!cfd) return;
          const formation = await deps.importFormation({ cfd });
          const ancienCfds = await deps.importFormationHistorique({ cfd });
          for (const ancienCfd of ancienCfds ?? []) {
            await importFormationEtablissements({ cfd: ancienCfd });
          }
          await importFormationEtablissements({ cfd });
          if (!formation) return;
        },
        { parallel: 20 }
      );
    };
  }
);

export const [importFormationEtablissements] = inject(
  {
    createFormationEtablissement,
    importEtablissement,
    importIndicateurEtablissement,
    importIndicateurEntree,
    importIndicateurSortie,
    getCfdRentrees,
    getCfdDispositifs,
    importIndicateursRegionSortie,
    importIndicateurSortieApprentissage,
    importIndicateursRegionSortieApprentissage,
    findUAIsApprentissage,
    findRawData: rawDataRepository.findRawData,
    findRawDatas: rawDataRepository.findRawDatas,
    findDataFormation,
    findFormationEtablissement,
    deleteFormationEtablissement
  },
  (deps) => {
    return async ({ cfd, voie = VoieEnum.scolaire }: { cfd: string; voie?: string }) => {
      if (voie === VoieEnum.apprentissage) {
        await deps.importIndicateursRegionSortieApprentissage({ cfd });
        const uais = await deps.findUAIsApprentissage({ cfd });
        if (!uais) return;
        for (const uai of uais) {
          if (!processedUais.has(uai)) {
            await deps.importEtablissement({ uai });
            for (const millesime of MILLESIMES_IJ) {
              await deps.importIndicateurEtablissement({ uai, millesime });
            }
            processedUais.add(uai);
          }

          // Récupération du codeDispositif pour les formations en apprentissage
          // à partir du contenu du fichier offres_apprentissage
          const offreApprentissage = await deps.findRawData({
            type: "offres_apprentissage",
            filter: { "Formation: code CFD": cfd },
          });

          if (!offreApprentissage) continue;

          const codesDispositifs: Array<string> = [];
          const mefs = offreApprentissage["Formation: codes MEF"]?.split(",").map((mef) => mef.trim()) ?? [];
          const dureeCollectee = offreApprentissage?.["Formation: durée collectée"]
            ? parseInt(offreApprentissage?.["Formation: durée collectée"])
            : -1;

          const dataFormation = await deps.findDataFormation({ cfd });
          const rentreesScolaires: string[] = extractYearFromTags(offreApprentissage["Offre: Tags"])
            .filter(year => isYearBetweenOuvertureAndFermeture(year, dataFormation));

          if (mefs.length > 0) {
            /**
             * Chercher ce MEF dans le fichier nMef le couple (FORMATION_DIPLOME, DISPOSITIF_FORMATION) qui correspond au (cfd, codeDispositif)
             */
            for (const mef of mefs) {
              const nMefs = await deps.findRawDatas({
                type: "nMef",
                filter: {
                  MEF: mef,
                  FORMATION_DIPLOME: cfd,
                },
              });

              nMefs.forEach((nMef) => {
                codesDispositifs.push(nMef.DISPOSITIF_FORMATION);
              });
            }
          } else {
            // déduire le code dispositif du cfd
            const codeDispositif = extractCfdFromMefAndDuree(offreApprentissage?.["Formation: code CFD"], dureeCollectee);
            if (codeDispositif > -1) {
              codesDispositifs.push(codeDispositif.toString());
            }
          }

          if (codesDispositifs.length > 0) {
            // Il faut supprimer les anciens CodeDispositif à null puisqu'on les a maintenant déduits
            const oldFormationEtablissement = await deps.findFormationEtablissement({
              uai, cfd, voie: VoieEnum.apprentissage, codeDispositif: null
            });

            if (oldFormationEtablissement) {
              console.log("Ancienne formationEtablissement trouvée avec un dispositif à null, suppression en cascade...", oldFormationEtablissement.id);
              await deps.deleteFormationEtablissement({ id: oldFormationEtablissement.id });
              console.log("Suppression ok", oldFormationEtablissement.id);
            }

            for (const codeDispositif of codesDispositifs) {
              const formationEtablissement = await deps.createFormationEtablissement({
                uai,
                cfd,
                codeDispositif,
                voie: VoieEnum.apprentissage,
              });

              for (const rentreeScolaire of rentreesScolaires) {
                await deps.importIndicateurEntree({
                  formationEtablissementId: formationEtablissement.id,
                  rentreeScolaire,
                  cfd,
                  uai,
                  anneesEnseignement: [],
                  anneesDispositif: {},
                  voie: VoieEnum.apprentissage
                });
              }

              for (const millesime of MILLESIMES_IJ) {
                await deps.importIndicateurSortieApprentissage({
                  uai,
                  formationEtablissementId: formationEtablissement.id,
                  millesime,
                  cfd,
                });
              }
            }
          } else {
            const formationEtablissement = await deps.createFormationEtablissement({
              uai,
              cfd,
              codeDispositif: null,
              voie: VoieEnum.apprentissage,
            });

            for (const rentreeScolaire of rentreesScolaires) {
              await deps.importIndicateurEntree({
                formationEtablissementId: formationEtablissement.id,
                rentreeScolaire,
                cfd,
                uai,
                anneesEnseignement: [],
                anneesDispositif: {},
                voie: VoieEnum.apprentissage
              });
            }

            for (const millesime of MILLESIMES_IJ) {
              await deps.importIndicateurSortieApprentissage({
                uai,
                formationEtablissementId: formationEtablissement.id,
                millesime,
                cfd,
              });
            }
          }
        }
      } else {
        const cfdDispositifs = await deps.getCfdDispositifs({ cfd });

        for (const cfdDispositif of cfdDispositifs) {
          const { codeDispositif, anneesDispositif } = cfdDispositif;

          const lastMefstat = Object.values(anneesDispositif).pop()?.mefstat;
          if (!lastMefstat) continue;

          await deps.importIndicateursRegionSortie({
            cfd,
            codeDispositif: codeDispositif,
            mefstat: lastMefstat,
          });

          for (const rentreeScolaire of RENTREES_SCOLAIRES) {
            const { enseignements } =
              (await deps.getCfdRentrees({
                cfd,
                codeDispositif,
                year: rentreeScolaire,
              })) ?? {};

            if (!enseignements) continue;

            for (const enseignement of enseignements) {
              const { uai, anneesEnseignement, voie } = enseignement;
              if (!processedUais.has(uai)) {
                await deps.importEtablissement({ uai });
                for (const millesime of MILLESIMES_IJ) {
                  await deps.importIndicateurEtablissement({ uai, millesime });
                }
                processedUais.add(uai);
              }
              const formationEtablissement = await deps.createFormationEtablissement({
                uai,
                cfd,
                codeDispositif: codeDispositif,
                voie,
              });

              await deps.importIndicateurEntree({
                formationEtablissementId: formationEtablissement.id,
                rentreeScolaire,
                cfd,
                uai,
                anneesEnseignement,
                anneesDispositif,
                voie: VoieEnum.scolaire
              });

              for (const millesime of MILLESIMES_IJ) {
                await deps.importIndicateurSortie({
                  uai,
                  mefstat: lastMefstat,
                  formationEtablissementId: formationEtablissement.id,
                  millesime,
                  cfd,
                  codeDispositif,
                });
              }
            }
          }
        }
      }
    };
  }
);
