import { Dispositif } from "../../entities/Dispositif";
import { NDispositifFormation } from "../../files/NDispositifFormation";
import { streamIt } from "../../utils/streamIt";
import { dependencies } from "./importDispositifs.dependencies";

const toDispositif = (data: NDispositifFormation): Dispositif => {
  return {
    codeDispositif: data.DISPOSITIF_FORMATION,
    codeNiveauDiplome: data.NIVEAU_FORMATION_DIPLOME,
    libelleDispositif: data.LIBELLE_LONG,
  };
};

const importDispositifsFactory =
  ({
    findNDispositifFormation = dependencies.findNDispositifFormation,
    createDispositif = dependencies.createDispositif,
  }) =>
  async () => {
    await streamIt(
      (count) => findNDispositifFormation({ offset: count, limit: 30 }),
      async (item) => {
        const dispositif = toDispositif(item);
        await createDispositif(dispositif);
      }
    );
  };

export const importDispositifs = importDispositifsFactory({});
