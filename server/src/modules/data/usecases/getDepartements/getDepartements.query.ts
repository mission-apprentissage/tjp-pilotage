import { kdb } from "../../../../db/db";
import { isInPerimetreIJDepartement } from "../../utils/isInPerimetreIJ";

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
      "formationEtablissement.uai",
      "etablissement.uai"
    )
    .select([
      "departement.codeDepartement as value",
      "departement.libelleDepartement as label",
    ])
    .where("departement.codeDepartement", "is not", null)
    .where(isInPerimetreIJDepartement)
    .distinct()
    .orderBy("label", "asc")
    .execute();
};
