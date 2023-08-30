import { inject } from "injecti";

import { NDispositifFormation } from "../../fileTypes/NDispositifFormation";
import { streamIt } from "../../utils/streamIt";
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
    (count) => deps.findNDispositifFormation({ offset: count, limit: 30 }),
    async (item) => {
      const dispositif = toDispositif(item);
      await deps.createDispositif(dispositif);
    }
  );
});
