import { expressionBuilder } from "kysely";
import { CURRENT_RENTREE, FIRST_ANNEE_CAMPAGNE } from "shared";

import { DB } from "../../../db/db";
import { isInDenominateurTauxTransfo } from "../../utils/isInDenominateurTauxTransfo";
import { isInPerimetreIJDataEtablissement } from "./isInPerimetreIJ";

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
      .where(isInDenominateurTauxTransfo)
      .where(isInPerimetreIJDataEtablissement)
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
