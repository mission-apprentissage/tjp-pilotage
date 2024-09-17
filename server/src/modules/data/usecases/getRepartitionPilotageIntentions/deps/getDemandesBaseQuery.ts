import { sql } from "kysely";
import { CURRENT_RENTREE } from "shared";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import { getMillesimeFromRentreeScolaire } from "shared/utils/getMillesime";

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
    .leftJoin("positionFormationRegionaleQuadrant", (join) =>
      join.on((eb) =>
        eb.and([
          eb(
            eb.ref("positionFormationRegionaleQuadrant.cfd"),
            "=",
            eb.ref("demande.cfd")
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
