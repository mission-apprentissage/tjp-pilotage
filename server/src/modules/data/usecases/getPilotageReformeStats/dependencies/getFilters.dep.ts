import { kdb } from "../../../../../db/db";
import { cleanNull } from "../../../../../utils/noNull";
import { notHistoriqueFormation } from "../../../utils/notHistorique";

export const getFilters = async () => {
  const filtersBase = kdb
    .selectFrom("formationScolaireView as formationView")
    .leftJoin(
      "formationEtablissement",
      "formationEtablissement.cfd",
      "formationView.cfd"
    )
    .leftJoin(
      "niveauDiplome",
      "niveauDiplome.codeNiveauDiplome",
      "formationView.codeNiveauDiplome"
    )
    .leftJoin(
      "etablissement",
      "etablissement.uai",
      "formationEtablissement.uai"
    )
    .leftJoin("region", "region.codeRegion", "etablissement.codeRegion")
    .where(notHistoriqueFormation)
    .distinct()
    .$castTo<{ label: string; value: string }>()
    .orderBy("label", "asc");

  const regions = filtersBase
    .select(["region.libelleRegion as label", "region.codeRegion as value"])
    .where("region.codeRegion", "is not", null)
    .execute();

  const diplomes = filtersBase
    .select([
      "niveauDiplome.libelleNiveauDiplome as label",
      "niveauDiplome.codeNiveauDiplome as value",
    ])
    .where("niveauDiplome.codeNiveauDiplome", "is not", null)
    .where("niveauDiplome.codeNiveauDiplome", "in", [
      "500",
      "320",
      "400",
      "10",
      "010",
      "461",
      "561",
    ])
    .execute();

  return {
    regions: (await regions).map(cleanNull),
    diplomes: (await diplomes).map(cleanNull),
  };
};
