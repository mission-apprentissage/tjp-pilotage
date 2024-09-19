import { expressionBuilder, sql } from "kysely";
import { CURRENT_RENTREE, FIRST_ANNEE_CAMPAGNE } from "shared";

import { DB } from "../../../db/db";

export const genericOnConstatRentree =
  ({
    codeNiveauDiplome,
    CPC,
    codeNsf,
    rentree = CURRENT_RENTREE,
    codeRegion,
    campagne = FIRST_ANNEE_CAMPAGNE,
  }: {
    codeNiveauDiplome?: string[];
    CPC?: string[];
    codeNsf?: string[];
    rentree?: string;
    codeRegion?: string;
    campagne?: string;
  }) =>
  () => {
    return expressionBuilder<DB, keyof DB>()
      .selectFrom("campagne")
      .leftJoin("constatRentree", (join) => join.onTrue())
      .leftJoin(
        "dataEtablissement",
        "dataEtablissement.uai",
        "constatRentree.uai"
      )
      .leftJoin("dataFormation", "dataFormation.cfd", "constatRentree.cfd")
      .where("constatRentree.rentreeScolaire", "=", rentree)
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
      .$call((eb) => {
        if (codeRegion)
          return eb.where("dataEtablissement.codeRegion", "=", codeRegion);
        return eb;
      })
      .$call((eb) => {
        if (CPC) return eb.where("dataFormation.cpc", "in", CPC);
        return eb;
      })
      .$call((eb) => {
        if (codeNsf) return eb.where("dataFormation.codeNsf", "in", codeNsf);
        return eb;
      })
      .$call((eb) => {
        if (codeNiveauDiplome)
          return eb.where(
            "dataFormation.codeNiveauDiplome",
            "in",
            codeNiveauDiplome
          );
        return eb;
      })
      .$call((eb) => {
        if (campagne) return eb.where("campagne.annee", "=", campagne);
        return eb;
      });
  };
