import { getKbdClient } from "@/db/db";
import { notHistoriqueFormation } from "@/modules/data/utils/notHistorique";
import { cleanNull } from "@/utils/noNull";

export const getFilters = async () => {
  const filtersBase = getKbdClient()
    .selectFrom("formationScolaireView as formationView")
    .leftJoin("formationEtablissement", "formationEtablissement.cfd", "formationView.cfd")
    .leftJoin("niveauDiplome", "niveauDiplome.codeNiveauDiplome", "formationView.codeNiveauDiplome")
    .leftJoin("etablissement", "etablissement.uai", "formationEtablissement.uai")
    .leftJoin("region", "region.codeRegion", "etablissement.codeRegion")
    .where(notHistoriqueFormation)
    .distinct()
    .$castTo<{ label: string; value: string }>()
    .orderBy("label", "asc");

  const regions = filtersBase
    .select(["region.libelleRegion as label", "region.codeRegion as value"])
    .where("region.codeRegion", "is not", null)
    .execute();

  const diplomes = getKbdClient().selectFrom("niveauDiplome")
    .select(["libelleNiveauDiplome as label", "codeNiveauDiplome as value"])
    .where("codeNiveauDiplome", "is not", null)
    .where("codeNiveauDiplome", "in", ["500", "320", "400", "461", "561", '010'])
    .$castTo<{ label: string; value: string }>()
    .orderBy("label", "asc")
    .execute();

  return {
    regions: (await regions).map(cleanNull),
    diplomes: (await diplomes).map(cleanNull),
  };
};
