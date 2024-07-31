import { expressionBuilder } from "kysely";
import { CURRENT_RENTREE } from "shared";

import { DB } from "../../../db/db";

export const genericOnConstatRentree =
  ({
    codeNiveauDiplome,
    CPC,
    codeNsf,
    rentree = CURRENT_RENTREE,
    codeRegion,
  }: {
    codeNiveauDiplome?: string[];
    CPC?: string[];
    codeNsf?: string[];
    rentree?: string;
    codeRegion?: string;
  }) =>
  () => {
    return expressionBuilder<DB, keyof DB>()
      .selectFrom("constatRentree")
      .leftJoin(
        "dataEtablissement",
        "dataEtablissement.uai",
        "constatRentree.uai"
      )
      .leftJoin("dataFormation", "dataFormation.cfd", "constatRentree.cfd")
      .where("constatRentree.rentreeScolaire", "=", rentree)
      .where("constatRentree.anneeDispositif", "=", 1)
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
      });
  };
