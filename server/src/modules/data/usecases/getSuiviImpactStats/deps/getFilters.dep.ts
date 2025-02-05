import { getKbdClient } from "@/db/db";
import { isInPerimetreIJRegion } from "@/modules/data/utils/isInPerimetreIJ";
import { cleanNull } from "@/utils/noNull";

export const getFilters = async () => {
  const regions = getKbdClient()
    .selectFrom("region")
    .where(isInPerimetreIJRegion)
    .distinct()
    .$castTo<{ label: string; value: string }>()
    .select(["region.libelleRegion as label", "region.codeRegion as value"])
    .orderBy("label", "asc")
    .execute();

  // Liste fixe des diplômes qui sont disponible dans les filtres de la page suivi de l'impact
  const diplomesDispoDansLesFiltres = ["500", "320", "400", "461", "561", '010', '241','401', '381', '481', '581'];

  const diplomes = getKbdClient().selectFrom("niveauDiplome")
    .select(["libelleNiveauDiplome as label", "codeNiveauDiplome as value"])
    .where("codeNiveauDiplome", "is not", null)
    .where("codeNiveauDiplome", "in", diplomesDispoDansLesFiltres)
    .$castTo<{ label: string; value: string }>()
    .orderBy("label", "asc")
    .execute();

  return {
    regions: (await regions).map(cleanNull),
    diplomes: (await diplomes).map(cleanNull),
  };
};
