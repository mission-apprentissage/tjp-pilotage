import { sql } from "kysely";

import { getKbdClient } from "@/db/db";
import { isInPerimetreIJDataEtablissement } from "@/modules/data/utils/isInPerimetreIJ";
import { isInDenominateurTauxTransfo } from "@/modules/utils/isInDenominateurTauxTransfo";

import type { Filters } from "./getFormationsPilotageIntentions.dep";

export const getEffectifsParCampagneCodeNiveauDiplomeCodeRegionQuery = ({ ...filters }: Filters) => {
  return getKbdClient()
    .selectFrom("campagne")
    .leftJoin("constatRentree", (join) => join.onTrue())
    .leftJoin("dataEtablissement", "dataEtablissement.uai", "constatRentree.uai")
    .leftJoin("dataFormation", "dataFormation.cfd", "constatRentree.cfd")
    .select((eb) => [
      "dataFormation.cfd",
      "dataFormation.codeNiveauDiplome",
      "dataEtablissement.codeRegion",
      "campagne.annee",
      "rentreeScolaire",
      sql<number>`SUM(${eb.ref("constatRentree.effectif")})`.as("denominateur"),
    ])
    .$call((eb) => {
      if (filters.CPC) return eb.where("dataFormation.cpc", "in", filters.CPC);
      return eb;
    })
    .$call((eb) => {
      if (filters.codeNsf) return eb.where("dataFormation.codeNsf", "in", filters.codeNsf);
      return eb;
    })
    .$call((eb) => {
      if (filters.codeNiveauDiplome)
        return eb.where("dataFormation.codeNiveauDiplome", "in", filters.codeNiveauDiplome);
      return eb;
    })
    .$call((eb) => {
      if (filters.codeRegion) return eb.where("dataEtablissement.codeRegion", "=", filters.codeRegion);
      return eb;
    })
    .$call((eb) => {
      if (filters.codeDepartement) return eb.where("dataEtablissement.codeDepartement", "=", filters.codeDepartement);
      return eb;
    })
    .$call((eb) => {
      if (filters.codeAcademie) return eb.where("dataEtablissement.codeAcademie", "=", filters.codeAcademie);
      return eb;
    })
    .$call((eb) => {
      if (filters.campagne) return eb.where("campagne.annee", "=", filters.campagne);
      return eb;
    })
    .$call((q) => {
      if (!filters.secteur || filters.secteur.length === 0) return q;
      return q.where("dataEtablissement.secteur", "in", filters.secteur);
    })
    .where(isInDenominateurTauxTransfo)
    .where(isInPerimetreIJDataEtablissement)
    .where("constatRentree.rentreeScolaire", "=", "2023")
    .groupBy([
      "annee",
      "rentreeScolaire",
      "dataFormation.cfd",
      "dataFormation.codeNiveauDiplome",
      "dataEtablissement.codeRegion",
    ]);
};
