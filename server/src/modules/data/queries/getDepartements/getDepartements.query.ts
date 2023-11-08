import { kdb } from "../../../../db/db";

export const getDepartements = () => {
  return kdb
    .selectFrom("departement")
    .innerJoin("etablissement", "etablissement.codeDepartement", "departement.codeDepartement")
    .innerJoin(
      "formationEtablissement",
      "formationEtablissement.UAI",
      "etablissement.UAI"
    )
    .select(["departement.codeDepartement as value", "departement.libelle as label"])
    .where("departement.codeDepartement", "is not", null)
    .distinct()
    .orderBy("label", "asc")
    .execute();
};
