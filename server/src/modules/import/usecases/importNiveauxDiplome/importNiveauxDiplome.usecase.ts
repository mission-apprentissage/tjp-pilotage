import { inject } from "injecti";

import { NNiveauFormationDiplome } from "../../fileTypes/NNiveauFormationDiplome";
import batchCreate from "../../utils/batchCreate";
import { streamIt } from "../../utils/streamIt";
import { dependencies } from "./dependencies";

const toNiveauDiplome = ({
  nNiveauDiplome,
}: {
  nNiveauDiplome: NNiveauFormationDiplome;
}) => {
  return {
    codeNiveauDiplome: nNiveauDiplome.NIVEAU_FORMATION_DIPLOME,
    libelleNiveauDiplome: nNiveauDiplome.LIBELLE_COURT,
  };
};

export const [importNiveauxDiplome, importNiveauxDiplomeFactory] =
  inject({
    findNNiveauDiplomes: dependencies.findNNiveauDiplomes,
    niveauDiplome: batchCreate(dependencies.createNiveauDiplome, 20, false),
  },
  (deps) => async () => {
    await streamIt(
      (count) => deps.findNNiveauDiplomes({ offset: count, limit: 30 }),
      async (nNiveauDiplome) => {
        const niveauDiplome = toNiveauDiplome({ nNiveauDiplome });
        await deps.niveauDiplome.create({ data: niveauDiplome });
      },
      { parallel: 20 },
      async () => {
        await deps.niveauDiplome.flush();
      }
    );
  }
);
