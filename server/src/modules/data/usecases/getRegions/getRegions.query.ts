import { getKbdClient } from "@/db/db";
import { isInPerimetreIJRegion } from "@/modules/data/utils/isInPerimetreIJ";

export const getRegions = () => {
  return getKbdClient()
    .selectFrom("region")
    .innerJoin("etablissement", "etablissement.codeRegion", "region.codeRegion")
    .innerJoin("formationEtablissement", "formationEtablissement.uai", "etablissement.uai")
    .select(["region.codeRegion as value", "region.libelleRegion as label"])
    .where("region.codeRegion", "is not", null)
    .where(isInPerimetreIJRegion)
    .distinct()
    .orderBy("label", "asc")
    .execute();
};
