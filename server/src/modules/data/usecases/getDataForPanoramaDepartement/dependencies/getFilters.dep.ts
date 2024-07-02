import { kdb } from "../../../../../db/db";
import { cleanNull } from "../../../../../utils/noNull";

export const getFilters = async ({
  codeDepartement,
}: {
  codeDepartement?: string;
}) => {
  const filtersBase = kdb
    .selectFrom("niveauDiplome")
    .leftJoin(
      "formationView",
      "formationView.codeNiveauDiplome",
      "niveauDiplome.codeNiveauDiplome"
    )
    .leftJoin(
      "formationEtablissement",
      "formationEtablissement.cfd",
      "formationView.cfd"
    )
    .leftJoin(
      "etablissement",
      "etablissement.UAI",
      "formationEtablissement.UAI"
    )
    .$call((eb) => {
      if (!codeDepartement) return eb;
      return eb.where("etablissement.codeDepartement", "=", codeDepartement);
    })
    .distinct()
    .$castTo<{ label: string; value: string }>()
    .orderBy("label", "asc");

  const diplomes = await filtersBase
    .select([
      "niveauDiplome.codeNiveauDiplome as value",
      "niveauDiplome.libelleNiveauDiplome as label",
    ])
    .where("formationView.codeNiveauDiplome", "is not", null)
    .execute();

  const libellesNsf = await filtersBase
    .leftJoin("nsf", "nsf.codeNsf", "formationView.codeNsf")
    .select(["nsf.libelleNsf as label", "formationView.codeNsf as value"])
    .where("nsf.libelleNsf", "is not", null)
    .execute();

  return {
    diplomes: diplomes.map(cleanNull),
    libellesNsf: libellesNsf.map(cleanNull),
  };
};
