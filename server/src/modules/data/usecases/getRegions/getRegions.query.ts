import { kdb } from "../../../../db/db";
import { notPerimetreIJRegion } from "../../utils/notPerimetreIJ";

export const getRegions = () => {
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
    .where(notPerimetreIJRegion)
    .distinct()
    .orderBy("label", "asc")
    .execute();
};
