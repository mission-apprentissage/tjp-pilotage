import { kdb } from "../../../../db/db";
import { notPerimetreIJDepartement } from "../../utils/notPerimetreIJ";

export const getDepartements = () => {
  return kdb
    .selectFrom("departement")
    .innerJoin(
      "etablissement",
      "etablissement.codeDepartement",
      "departement.codeDepartement"
    )
    .innerJoin(
      "formationEtablissement",
      "formationEtablissement.UAI",
      "etablissement.UAI"
    )
    .select([
      "departement.codeDepartement as value",
      "departement.libelle as label",
    ])
    .where("departement.codeDepartement", "is not", null)
    .where(notPerimetreIJDepartement)
    .distinct()
    .orderBy("label", "asc")
    .execute();
};
