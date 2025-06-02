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
