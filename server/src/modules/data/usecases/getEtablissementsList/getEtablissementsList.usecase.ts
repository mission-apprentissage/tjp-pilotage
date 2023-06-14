import { inject } from "injecti";

import { kdb } from "../../../../db/db";
import { cleanNull } from "../../../../utils/noNull";

const queryEtablissementsInDB = async () => {
  return kdb
    .selectFrom("etablissement")
    .innerJoin(
      "formationEtablissement",
      "formationEtablissement.UAI",
      "etablissement.UAI"
    )
    .select("etablissement.libelleEtablissement as label")
    .$narrowType<{ label: string }>()
    .select(["etablissement.UAI as value"])
    .where("etablissement.UAI", "is not", null)
    .where("etablissement.libelleEtablissement", "is not", null)
    .distinct()
    .orderBy("label", "asc")
    .execute();
};

export const [getEtablissementsList] = inject(
  { queryEtablissementsInDB },
  (deps) => async () => {
    return (await deps.queryEtablissementsInDB()).map(cleanNull);
  }
);
