import { NiveauDiplome } from "../../entities/NiveauDiplome";
import { NNiveauFormationDiplome } from "../../files/NNiveauFormationDiplome";
import { streamIt } from "../../utils/streamIt";
import { dependencies } from "./dependencies";

const toNiveauDiplome = ({
  nNiveauDiplome,
}: {
  nNiveauDiplome: NNiveauFormationDiplome;
}): NiveauDiplome => {
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
    streamIt(
      (count) => findNNiveauDiplomes({ offset: count, limit: 30 }),
      async (nNiveauDiplome) => {
        const niveauDiplome = toNiveauDiplome({ nNiveauDiplome });
        await createNiveauDiplome(niveauDiplome);
      }
    );
  };

export const importNiveauxDiplome = importNiveauxDiplomeFactory({});
