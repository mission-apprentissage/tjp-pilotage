import { sql } from "kysely";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import { kdb } from "../../../../../db/db";
import { Filters } from "../getRepartitionPilotageIntentions.usecase";

export const getDemandesBaseQuery = ({ ...filters }: Filters) => {
  return kdb
    .selectFrom("latestDemandeIntentionView as demande")
    .innerJoin("dataFormation", "demande.cfd", "dataFormation.cfd")
    .innerJoin("dataEtablissement", "demande.uai", "dataEtablissement.uai")
    .innerJoin(
      "niveauDiplome",
      "dataFormation.codeNiveauDiplome",
      "niveauDiplome.codeNiveauDiplome"
    )
    .innerJoin("nsf", "dataFormation.codeNsf", "nsf.codeNsf")
    .innerJoin("region", "dataEtablissement.codeRegion", "region.codeRegion")
    .innerJoin("positionFormationRegionaleQuadrant", (join) =>
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
    .innerJoin("campagne", "demande.campagneId", "campagne.id")
    .select((eb) => [
      "positionFormationRegionaleQuadrant.positionQuadrant",
      "rentreeScolaire",
      "campagne.annee",
      "nsf.libelleNsf",
      "nsf.codeNsf",
      "niveauDiplome.libelleNiveauDiplome",
      "niveauDiplome.codeNiveauDiplome",
      "region.libelleRegion",
      "region.codeRegion",
      "demande.cfd",
      "demande.typeDemande",
      "demande.statut",
      sql<number>`
      GREATEST(0,
        ${eb.ref("demande.capaciteScolaire")} -
        ${eb.ref("demande.capaciteScolaireActuelle")}
      )`.as("placesOuvertesScolaire"),
      sql<number>`
      ABS(
        LEAST(0,
          ${eb.ref("demande.capaciteScolaire")} -
          ${eb.ref("demande.capaciteScolaireActuelle")}
        )
      )`.as("placesFermeesScolaire"),
      sql<number>`
        CASE WHEN ${eb.ref("demande.typeDemande")} = 'coloration'
        THEN ${eb.ref("demande.capaciteScolaireColoree")}
        ELSE 0
        END
      `.as("placesColoreesScolaire"),
      sql<number>`
        GREATEST(0,
          ${eb.ref("demande.capaciteApprentissage")} -
          ${eb.ref("demande.capaciteApprentissageActuelle")}
        )
      `.as("placesOuvertesApprentissage"),
      sql<number>`
      ABS(
        LEAST(0,
          ${eb.ref("demande.capaciteApprentissage")} -
          ${eb.ref("demande.capaciteApprentissageActuelle")}
        )
      )`.as("placesFermeesApprentissage"),
      sql<number>`
        CASE WHEN ${eb.ref("demande.typeDemande")} = 'coloration'
        THEN ${eb.ref("demande.capaciteApprentissageColoree")}
        ELSE 0
        END
      `.as("placesColoreesApprentissage"),
    ])
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
    .$call((q) => {
      if (!filters.statut)
        return q.where("demande.statut", "in", [
          DemandeStatutEnum["demande validée"],
          DemandeStatutEnum["projet de demande"],
        ]);
      return q.where("demande.statut", "=", filters.statut);
    })
    .$call((eb) => {
      if (filters.campagne)
        return eb.where("campagne.annee", "=", filters.campagne);
      return eb;
    });
};
