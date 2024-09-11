import { sql } from "kysely";

import { kdb } from "../../../../../db/db";
import { Filters } from "../getRepartitionPilotageIntentions.usecase";

export const getEffectifsParCampagneQuery = ({ ...filters }: Filters) => {
  return kdb
    .selectFrom("campagne")
    .leftJoin("constatRentree", (join) => join.onTrue())
    .leftJoin(
      "dataEtablissement",
      "dataEtablissement.uai",
      "constatRentree.uai"
    )
    .leftJoin("dataFormation", "dataFormation.cfd", "constatRentree.cfd")
    .leftJoin("nsf", "nsf.codeNsf", "dataFormation.codeNsf")
    .leftJoin(
      "niveauDiplome",
      "niveauDiplome.codeNiveauDiplome",
      "dataFormation.codeNiveauDiplome"
    )
    .leftJoin("region", "region.codeRegion", "dataEtablissement.codeRegion")
    .leftJoin("positionFormationRegionaleQuadrant", (join) =>
      join
        .onRef(
          "positionFormationRegionaleQuadrant.codeRegion",
          "=",
          "dataEtablissement.codeRegion"
        )
        .onRef(
          "positionFormationRegionaleQuadrant.cfd",
          "=",
          "dataFormation.cfd"
        )
        .onRef(
          "positionFormationRegionaleQuadrant.codeNiveauDiplome",
          "=",
          "dataFormation.codeNiveauDiplome"
        )
    )
    .select((eb) => [
      "nsf.libelleNsf",
      "nsf.codeNsf",
      "niveauDiplome.libelleNiveauDiplome",
      "niveauDiplome.codeNiveauDiplome",
      "positionFormationRegionaleQuadrant.positionQuadrant",
      "region.libelleRegion",
      "region.codeRegion",
      "campagne.annee",
      "rentreeScolaire",
      sql<number>`SUM(${eb.ref("constatRentree.effectif")})`.as("denominateur"),
    ])
    .$call((eb) => {
      if (filters.campagne)
        return eb.where("campagne.annee", "=", filters.campagne);
      return eb;
    })
    .where(
      sql<boolean>`
      CASE WHEN "campagne"."annee" = '2023' THEN "constatRentree"."anneeDispositif" = 1
      ELSE
        CASE WHEN "dataFormation"."typeFamille" in ('specialite', 'option') THEN "constatRentree"."anneeDispositif" = 2
        WHEN "dataFormation"."typeFamille" in ('2nde_commune', '1ere_commune') THEN false
        ELSE "constatRentree"."anneeDispositif" = 1
        END
      END
      `
    )
    .where("constatRentree.rentreeScolaire", "=", "2023")
    .groupBy([
      "annee",
      "rentreeScolaire",
      "libelleNsf",
      "nsf.codeNsf",
      "libelleNiveauDiplome",
      "niveauDiplome.codeNiveauDiplome",
      "libelleRegion",
      "region.codeRegion",
      "positionQuadrant",
    ]);
};
