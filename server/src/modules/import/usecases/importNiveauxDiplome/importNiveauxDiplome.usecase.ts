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
      { parallel: 20 },
    );
  };

export const importNiveauxDiplome = importNiveauxDiplomeFactory({});
