import { inject } from "injecti";

import { kdb } from "../../../../db/db";

const queryRegionsInDB = async () => {
  return kdb
    .selectFrom("region")
    .innerJoin("etablissement", "etablissement.codeRegion", "region.codeRegion")
    .innerJoin(
      "formationEtablissement",
      "formationEtablissement.UAI",
      "etablissement.UAI"
    )
    .select(["region.codeRegion as value", "region.libelleRegion as label"])
    .where("region.codeRegion", "is not", null)
    .distinct()
    .orderBy("label", "asc")
    .execute();
};

export const [getRegions] = inject({ queryRegionsInDB }, (deps) => async () => {
  return deps.queryRegionsInDB();
});
