/**
 * Importe les niveaux de formation diplômante (CAP, BP, BAC, BTS, Licence, etc.).
 *
 * Fichiers rawData utilisés :
 * - "nNiveauFormationDiplome_" : données des niveaux de formation (NIVEAU_FORMATION_DIPLOME, LIBELLE_COURT)
 *
 * Cette fonction :
 * 1. Récupère les niveaux de formation depuis rawData type "nNiveauFormationDiplome_"
 * 2. Extrait le code niveau diplôme et son libellé court
 * 3. Insère ou met à jour une ligne dans la table "niveauDiplome" avec code et libellé
 *
 * Retourne le nombre total de niveaux de diplômes importés.
 */

import type { NNiveauFormationDiplome } from "@/modules/import/fileTypes/NNiveauFormationDiplome";
import { streamIt } from "@/modules/import/utils/streamIt";

import { dependencies } from "./dependencies";

const toNiveauDiplome = ({ nNiveauDiplome }: { nNiveauDiplome: NNiveauFormationDiplome }) => {
  return {
    codeNiveauDiplome: nNiveauDiplome.NIVEAU_FORMATION_DIPLOME,
    libelleNiveauDiplome: nNiveauDiplome.LIBELLE_COURT,
  };
};

export const importNiveauxDiplomeFactory =
  ({
    findNNiveauDiplomes = dependencies.findNNiveauDiplomes,
    createNiveauDiplome = dependencies.createNiveauDiplome,
  }) =>
    async () => {
      await streamIt(
        async (count) => findNNiveauDiplomes({ offset: count, limit: 30 }),
        async (nNiveauDiplome) => {
          const niveauDiplome = toNiveauDiplome({ nNiveauDiplome });
          await createNiveauDiplome(niveauDiplome);
        },
        { parallel: 20 }
      );
    };

export const importNiveauxDiplome = importNiveauxDiplomeFactory({});
