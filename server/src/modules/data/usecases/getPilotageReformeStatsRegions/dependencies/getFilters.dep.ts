import { kdb } from "../../../../../db/db";
import { cleanNull } from "../../../../../utils/noNull";
import { notHistoriqueFormation } from "../../../utils/notHistorique";

export const getFilters = async () => {
  const filtersBase = kdb
    .selectFrom("formationScolaireView as formationView")
    .leftJoin(
      "niveauDiplome",
      "niveauDiplome.codeNiveauDiplome",
      "formationView.codeNiveauDiplome"
    )
    .where(notHistoriqueFormation)
    .distinct()
    .$castTo<{ label: string; value: string }>();

  const diplomes = filtersBase
    .select([
      "niveauDiplome.libelleNiveauDiplome as label",
      "niveauDiplome.codeNiveauDiplome as value",
    ])
    .where("niveauDiplome.codeNiveauDiplome", "is not", null)
    .where("niveauDiplome.codeNiveauDiplome", "in", ["500", "320", "400"])
    .execute();

  return {
    diplomes: (await diplomes).map(cleanNull),
  };
};
