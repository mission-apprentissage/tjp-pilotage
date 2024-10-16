import { getKbdClient } from "@/db/db";
import {
  isInPerimetreIJAcademie,
  isInPerimetreIJDepartement,
  isInPerimetreIJRegion,
} from "@/modules/data/utils/isInPerimetreIJ";

export const getFilters = async () => {
  const regions = await getKbdClient()
    .selectFrom("region")
    .select(["region.libelleRegion as label", "region.codeRegion as value"])
    .where(isInPerimetreIJRegion)
    .orderBy("region.libelleRegion", "asc")
    .execute();

  const academies = await getKbdClient()
    .selectFrom("academie")
    .select([
      "academie.libelleAcademie as label",
      "academie.codeAcademie as value",
      "academie.codeRegion as codeRegion",
    ])
    .where(isInPerimetreIJAcademie)
    .orderBy("academie.libelleAcademie", "asc")
    .execute();

  const departements = await getKbdClient()
    .selectFrom("departement")
    .select([
      "departement.libelleDepartement as label",
      "departement.codeDepartement as value",
      "departement.codeAcademie as codeAcademie",
      "departement.codeRegion as codeRegion",
    ])
    .where(isInPerimetreIJDepartement)
    .orderBy("departement.libelleDepartement", "asc")
    .execute();

  return {
    regions,
    academies,
    departements,
  };
};
