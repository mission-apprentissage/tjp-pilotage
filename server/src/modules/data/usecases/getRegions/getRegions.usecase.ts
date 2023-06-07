import { inject } from "injecti";

import { kdb } from "../../../../db/db";

const queryRegionsInDB = async () => {
  return kdb
    .selectFrom("region")
    .select(["codeRegion as value", "libelleRegion as label"])
    .distinct()
    .orderBy("label", "asc")
    .execute();
};

export const [getRegions] = inject({ queryRegionsInDB }, (deps) => async () => {
  return deps.queryRegionsInDB();
});
