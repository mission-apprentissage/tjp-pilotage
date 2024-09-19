import { sql } from "kysely";
import { CURRENT_RENTREE } from "shared";
import { getMillesimeFromRentreeScolaire } from "shared/utils/getMillesime";

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
    .leftJoin("positionFormationRegionaleQuadrant", (join) =>
      join.on((eb) =>
        eb.and([
          eb(
            eb.ref("positionFormationRegionaleQuadrant.cfd"),
            "=",
            eb.ref("dataFormation.cfd")
          ),
          eb(
            eb.ref("positionFormationRegionaleQuadrant.codeRegion"),
            "=",
            eb.ref("dataEtablissement.codeRegion")
          ),
          eb(
            eb.ref("positionFormationRegionaleQuadrant.millesimeSortie"),
            "=",
            eb.val(
              getMillesimeFromRentreeScolaire({
                rentreeScolaire: CURRENT_RENTREE,
                offset: 0,
              })
            )
          ),
        ])
      )
    )
    .select((eb) => [
      "dataFormation.codeNsf",
      "dataFormation.codeNiveauDiplome",
      "positionFormationRegionaleQuadrant.positionQuadrant",
      "dataEtablissement.codeRegion",
      "dataEtablissement.codeDepartement",
      "dataEtablissement.codeAcademie",
      "campagne.annee",
      "rentreeScolaire",
      sql<number>`SUM(${eb.ref("constatRentree.effectif")})`.as("denominateur"),
    ])
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
    .where("constatRentree.rentreeScolaire", "=", CURRENT_RENTREE)
    .$call((eb) => {
      if (filters.CPC) return eb.where("dataFormation.cpc", "in", filters.CPC);
      return eb;
    })
    .$call((eb) => {
      if (filters.codeNsf)
        return eb.where("dataFormation.codeNsf", "in", filters.codeNsf);
      return eb;
    })
    .$call((eb) => {
      if (filters.codeNiveauDiplome)
        return eb.where(
          "dataFormation.codeNiveauDiplome",
          "in",
          filters.codeNiveauDiplome
        );
      return eb;
    })
    .$call((eb) => {
      if (filters.codeRegion)
        return eb.where(
          "dataEtablissement.codeRegion",
          "=",
          filters.codeRegion
        );
      return eb;
    })
    .$call((eb) => {
      if (filters.codeDepartement)
        return eb.where(
          "dataEtablissement.codeDepartement",
          "=",
          filters.codeDepartement
        );
      return eb;
    })
    .$call((eb) => {
      if (filters.codeAcademie)
        return eb.where(
          "dataEtablissement.codeAcademie",
          "=",
          filters.codeAcademie
        );
      return eb;
    })
    .$call((eb) => {
      if (filters.campagne)
        return eb.where("campagne.annee", "=", filters.campagne);
      return eb;
    })
    .$call((q) => {
      if (!filters.secteur || filters.secteur.length === 0) return q;
      return q.where("dataEtablissement.secteur", "in", filters.secteur);
    })
    .groupBy([
      "annee",
      "rentreeScolaire",
      "dataFormation.codeNsf",
      "dataFormation.codeNiveauDiplome",
      "dataEtablissement.codeRegion",
      "dataEtablissement.codeDepartement",
      "dataEtablissement.codeAcademie",
      "positionQuadrant",
    ]);
};
