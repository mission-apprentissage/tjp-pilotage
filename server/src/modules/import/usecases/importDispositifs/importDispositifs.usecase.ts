/**
 * Importe les dispositifs de formation avec leurs niveaux et libellés.
 *
 * Fichiers rawData utilisés :
 * - "nDispositifFormation_" : données des dispositifs de formation (DISPOSITIF_FORMATION, NIVEAU_FORMATION_DIPLOME, LIBELLE_LONG)
 *
 * Cette fonction :
 * 1. Récupère les dispositifs depuis rawData type "nDispositifFormation_"
 * 2. Transforme les données en récupérant codeDispositif, codeNiveauDiplome et libelleDispositif
 * 3. Insère ou met à jour une ligne dans la table "dispositif" avec le code, niveau et libellé
 *
 * Retourne le nombre total de dispositifs importés.
 */

import type { NDispositifFormation } from "@/modules/import/fileTypes/NDispositifFormation";
import { streamIt } from "@/modules/import/utils/streamIt";
import { inject } from "@/utils/inject";

import { dependencies } from "./importDispositifs.dependencies";

const toDispositif = (data: NDispositifFormation) => {
  return {
    codeDispositif: data.DISPOSITIF_FORMATION,
    codeNiveauDiplome: data.NIVEAU_FORMATION_DIPLOME,
    libelleDispositif: data.LIBELLE_LONG,
  };
};

export const [importDispositifs] = inject(dependencies, (deps) => async () => {
  await streamIt(
    async (count) => deps.findNDispositifFormation({ offset: count, limit: 30 }),
    async (item) => {
      const dispositif = toDispositif(item);
      await deps.createDispositif(dispositif);
    },
    { parallel: 20 }
  );
});
