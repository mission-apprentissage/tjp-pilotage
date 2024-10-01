import { sql } from "kysely";
import { PositionQuadrantEnum } from "shared/enum/positionQuadrantEnum";

import { kdb } from "../../../../../db/db";
import { cleanNull } from "../../../../../utils/noNull";
import { genericOnConstatRentree } from "../../../utils/onConstatDeRentree";
import { Filters } from "../getRepartitionPilotageIntentions.usecase";

export const getDenominateurQuery = async ({
  filters,
}: {
  filters: Filters;
}) => {
  return kdb
    .selectFrom(
      genericOnConstatRentree(filters)()
        .select((eb) => [
          eb.ref("campagne.annee").as("annee"),
          eb.ref("constatRentree.rentreeScolaire").as("rentreeScolaire"),
          eb.ref("dataFormation.codeNsf").as("codeNsf"),
          eb.ref("dataFormation.codeNiveauDiplome").as("codeNiveauDiplome"),
          sql<string>`
            COALESCE(
            ${eb.ref("positionFormationRegionaleQuadrant.positionQuadrant")},
            ${eb.val(PositionQuadrantEnum["Hors quadrant"])}
          )`.as("positionQuadrant"),
          eb.ref("dataEtablissement.codeRegion").as("codeRegion"),
          eb.ref("dataEtablissement.codeAcademie").as("codeAcademie"),
          eb.ref("dataEtablissement.codeDepartement").as("codeDepartement"),
          sql<number>`SUM(${eb.ref("constatRentree.effectif")})`.as("effectif"),
        ])
        .groupBy([
          "annee",
          "rentreeScolaire",
          "dataEtablissement.codeRegion",
          "positionQuadrant",
          "constatRentree.cfd",
          "dataFormation.codeNsf",
          "dataFormation.codeNiveauDiplome",
          "dataEtablissement.codeAcademie",
          "dataEtablissement.codeDepartement",
        ])
        .as("effectifs")
    )
    .innerJoin(
      "niveauDiplome",
      "niveauDiplome.codeNiveauDiplome",
      "effectifs.codeNiveauDiplome"
    )
    .innerJoin("region", "region.codeRegion", "effectifs.codeRegion")
    .innerJoin(
      "departement",
      "departement.codeDepartement",
      "effectifs.codeDepartement"
    )
    .innerJoin("academie", "academie.codeAcademie", "effectifs.codeAcademie")
    .innerJoin("nsf", "nsf.codeNsf", "effectifs.codeNsf")
    .select((eb) => [
      "annee",
      "rentreeScolaire",
      "region.codeRegion",
      "region.libelleRegion",
      "positionQuadrant",
      // "cfd",
      "nsf.codeNsf",
      "nsf.libelleNsf",
      "niveauDiplome.codeNiveauDiplome",
      "niveauDiplome.libelleNiveauDiplome",
      "academie.codeAcademie",
      "academie.libelleAcademie",
      "departement.codeDepartement",
      "departement.libelleDepartement",
      eb.fn.coalesce("effectif", eb.val(0)).as("effectif"),
    ])
    .execute()
    .then(cleanNull);
};
