/**
 * Importe les diplômes professionnels pour les deux voies de formation (scolaire et apprentissage).
 *
 * Fichiers rawData utilisés :
 * - "diplomesProfessionnels" : données des diplômes scolaires (Code diplôme, Intitulé de la spécialité, Commission professionnelle consultative, Secteur, Sous-secteur, Code RNCP)
 * - "offres_apprentissage" : données des offres d'apprentissage pour extraire les CFD en apprentissage (Formation: code CFD)
 *
 * Cette fonction :
 * 1. Récupère les diplômes professionnels depuis rawData type "diplomesProfessionnels"
 * 2. Normalise le CFD (supprime tirets, limite à 8 caractères, valide le format numérique)
 * 3. Insère ou met à jour une ligne dans la table "diplomeProfessionnel" avec CFD et voie "scolaire"
 * 4. Récupère les CFD depuis rawData type "offres_apprentissage" (filtrés sur CFD de niveau 3, 4, 5)
 * 5. Insère ou met à jour une ligne dans la table "diplomeProfessionnel" avec CFD et voie "apprentissage"
 * 6. Gère les erreurs pour les deux voies
 *
 * Rapport d'erreurs d'import :
 * - Chemin : `server/dist/import_files_report.csv` (relatif à la racine du projet, créé au runtime)
 * - Les erreurs de validation des fichiers CSV y sont enregistrées
 *
 * Retourne le nombre total de diplômes professionnels importés (scolaire + apprentissage).
 */

import type { DiplomeProfessionnelLine } from "@/modules/import/fileTypes/DiplomesProfessionnels";
import { streamIt } from "@/modules/import/utils/streamIt";
import { inject } from "@/utils/inject";

import { createDiplomeProfessionnel } from "./createDiplomeProfessionnel.dep";
import { findDiplomesProfessionnels } from "./findDiplomeProfessionnel.dep";
import { findOffresApprentissages } from "./findOffresApprentissages";

const formatCFDDiplomeProfessionnel = (line: DiplomeProfessionnelLine) => {
  if (!line["Code diplôme"]) return;
  const cfd = line["Code diplôme"].replace("-", "").slice(0, 8);

  if (isNaN(parseInt(cfd))) return;
  return cfd;
};

export const [importDiplomesProfessionnels] = inject(
  {
    findDiplomesProfessionnels,
    findOffresApprentissages,
    createDiplomeProfessionnel,
  },
  (deps) => async () => {
    console.log("Import des diplomeProfessionnel");
    let errorCount = 0;
    await streamIt(
      async (count) => deps.findDiplomesProfessionnels({ offset: count, limit: 60 }),
      async (diplomeProfessionnel, count) => {
        const cfd = formatCFDDiplomeProfessionnel(diplomeProfessionnel);
        if (!cfd) {
          console.log(
            "\n--\nIl manque le CFD pour ce diplome professionnel : ",
            JSON.stringify(diplomeProfessionnel),
            "\n--\n"
          );
          return;
        }

        try {
          await deps.createDiplomeProfessionnel({
            cfd,
            voie: "scolaire",
          });
        } catch (e) {
          console.log(e);
          errorCount++;
        }
        process.stdout.write(`\r${count} diplomeProfessionnel (scolaire) ajoutés ou mis à jour`);
      },
      { parallel: 20 }
    ).then(() => {
      process.stdout.write(errorCount > 0 ? `(avec ${errorCount} erreurs)\n\n` : "\n\n");
    });
    console.log("Import des diplomeProfessionnel (apprentissage)");
    errorCount = 0;
    await streamIt(
      async (count) => deps.findOffresApprentissages({ offset: count, limit: 60 }),
      async (cfd, count) => {
        if (!cfd) return;
        try {
          await deps.createDiplomeProfessionnel({
            cfd,
            voie: "apprentissage",
          });
        } catch (e) {
          console.log(e);
          errorCount++;
        }
        process.stdout.write(`\r${count} diplomeProfessionnel (apprentissage) ajoutés ou mis à jour`);
      },
      { parallel: 20 }
    ).then(() => {
      process.stdout.write(errorCount > 0 ? `(avec ${errorCount} erreurs)\n\n` : "\n\n");
    });
  }
);
