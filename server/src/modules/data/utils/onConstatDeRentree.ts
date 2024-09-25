import { expressionBuilder } from "kysely";
import { CURRENT_RENTREE, FIRST_ANNEE_CAMPAGNE } from "shared";

import { DB } from "../../../db/db";
import { isInDenominateurTauxTransfo } from "../../utils/isInDenominateurTauxTransfo";

export const genericOnConstatRentree =
  ({
    codeNiveauDiplome,
    CPC,
    codeNsf,
    rentree = CURRENT_RENTREE,
    codeRegion,
    codeAcademie,
    codeDepartement,
    campagne = FIRST_ANNEE_CAMPAGNE,
    secteur,
  }: {
    codeNiveauDiplome?: string[];
    CPC?: string[];
    codeNsf?: string[];
    rentree?: string;
    codeRegion?: string;
    codeAcademie?: string;
    codeDepartement?: string;
    campagne?: string;
    secteur?: string[];
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
      .where(isInDenominateurTauxTransfo)
      .$call((eb) => {
        if (campagne) return eb.where("campagne.annee", "=", campagne);
        return eb;
      })
      .where("constatRentree.rentreeScolaire", "=", rentree)
      .$call((eb) => {
        if (codeRegion)
          return eb.where("dataEtablissement.codeRegion", "=", codeRegion);
        return eb;
      })
      .$call((eb) => {
        if (codeAcademie)
          return eb.where("dataEtablissement.codeAcademie", "=", codeAcademie);
        return eb;
      })
      .$call((eb) => {
        if (codeDepartement)
          return eb.where(
            "dataEtablissement.codeDepartement",
            "=",
            codeDepartement
          );
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
        if (codeNsf) return eb.where("dataFormation.codeNsf", "in", codeNsf);
        return eb;
      })
      .$call((eb) => {
        if (CPC) return eb.where("dataFormation.cpc", "in", CPC);
        return eb;
      })
      .$call((q) => {
        if (!secteur || secteur.length === 0) return q;
        return q.where("dataEtablissement.secteur", "in", secteur);
      });
  };
