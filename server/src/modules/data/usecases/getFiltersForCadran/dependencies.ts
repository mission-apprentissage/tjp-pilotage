import { ExpressionBuilder, sql } from "kysely";

import { kdb } from "../../../../db/db";
import { DB } from "../../../../db/schema";
import { cleanNull } from "../../../../utils/noNull";

export const findFiltersInDb = async ({
  codeRegion,
}: {
  codeRegion?: string;
}) => {
  const base = kdb
    .selectFrom("formation")
    .innerJoin(
      "formationEtablissement",
      "formationEtablissement.cfd",
      "formation.codeFormationDiplome"
    )
    .innerJoin("indicateurEntree", (join) =>
      join
        .onRef(
          "formationEtablissement.id",
          "=",
          "indicateurEntree.formationEtablissementId"
        )
        .on("indicateurEntree.rentreeScolaire", "=", "2022")
    )
    .innerJoin("indicateurSortie", (join) =>
      join
        .onRef(
          "formationEtablissement.id",
          "=",
          "indicateurSortie.formationEtablissementId"
        )
        .on("indicateurSortie.millesimeSortie", "=", "2020_2021")
    )
    .innerJoin(
      "niveauDiplome",
      "niveauDiplome.codeNiveauDiplome",
      "formation.codeNiveauDiplome"
    )
    .innerJoin(
      "etablissement",
      "etablissement.UAI",
      "formationEtablissement.UAI"
    )
    .innerJoin("region", "region.codeRegion", "etablissement.codeRegion")
    .where(
      "codeFormationDiplome",
      "not in",
      sql`(SELECT DISTINCT "ancienCFD" FROM "formationHistorique")`
    )
    .distinct()
    .$castTo<{ label: string; value: string }>()
    .orderBy("label", "asc");

  const inCodeRegion = (eb: ExpressionBuilder<DB, "region">) => {
    if (!codeRegion) return sql<true>`true`;
    return eb.and([eb.cmpr("region.codeRegion", "=", codeRegion)]);
  };

  const regions = await base
    .select(["region.libelleRegion as label", "region.codeRegion as value"])
    .where("region.codeRegion", "is not", null)
    .execute();

  const diplomes = await base
    .select([
      "niveauDiplome.libelleNiveauDiplome as label",
      "niveauDiplome.codeNiveauDiplome as value",
    ])
    .where("niveauDiplome.codeNiveauDiplome", "is not", null)
    .where(inCodeRegion)
    .execute();

  return await {
    regions: (await regions).map(cleanNull),
    diplomes: (await diplomes).map(cleanNull),
  };
};
