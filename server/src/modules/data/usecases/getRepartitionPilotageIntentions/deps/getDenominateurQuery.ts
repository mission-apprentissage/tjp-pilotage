import { sql } from "kysely";

import { getKbdClient } from "@/db/db";
import type { Filters } from "@/modules/data/usecases/getRepartitionPilotageIntentions/getRepartitionPilotageIntentions.usecase";
import { genericOnConstatRentree } from "@/modules/data/utils/onConstatDeRentree";
import { selectPositionQuadrant } from "@/modules/data/utils/selectPositionQuadrant";
import { cleanNull } from "@/utils/noNull";

export const getDenominateurQuery = async ({ filters }: { filters: Filters }) => {
  return getKbdClient()
    .selectFrom(
      genericOnConstatRentree(filters)
        .select((eb) => [
          eb.ref("campagne.annee").as("annee"),
          eb.ref("constatRentree.rentreeScolaire").as("rentreeScolaire"),
          eb.ref("dataFormation.codeNsf").as("codeNsf"),
          eb.ref("dataFormation.codeNiveauDiplome").as("codeNiveauDiplome"),
          selectPositionQuadrant(eb).as("positionQuadrant"),
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
          "dataFormation.typeFamille",
          "dataEtablissement.codeAcademie",
          "dataEtablissement.codeDepartement",
        ])
        .as("effectifs")
    )
    .innerJoin("niveauDiplome", "niveauDiplome.codeNiveauDiplome", "effectifs.codeNiveauDiplome")
    .innerJoin("region", "region.codeRegion", "effectifs.codeRegion")
    .innerJoin("departement", "departement.codeDepartement", "effectifs.codeDepartement")
    .innerJoin("academie", "academie.codeAcademie", "effectifs.codeAcademie")
    .innerJoin("nsf", "nsf.codeNsf", "effectifs.codeNsf")
    .select((eb) => [
      "annee",
      "rentreeScolaire",
      "region.codeRegion",
      "region.libelleRegion",
      "positionQuadrant",
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
