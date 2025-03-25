
import { getMillesimeFromCampagne } from "shared/time/millesimes";

import { getKbdClient } from "@/db/db";
import type { Filters } from "@/modules/data/usecases/getFormationsPilotageIntentions/getFormationsPilotageIntentions.usecase";
import { isScolaireIndicateurRegionSortie } from "@/modules/data/utils/isScolaire";
import { notAnneeCommuneIndicateurRegionSortie } from "@/modules/data/utils/notAnneeCommune";
import { notHistoriqueIndicateurRegionSortie } from "@/modules/data/utils/notHistorique";
import { selectTauxInsertion6moisAgg } from "@/modules/data/utils/tauxInsertion6mois";
import { selectTauxPoursuiteAgg } from "@/modules/data/utils/tauxPoursuite";

export const getStatsSortieQuery = async ({ filters }: {filters: Filters}) => {
  return getKbdClient()
    .selectFrom("indicateurRegionSortie")
    .innerJoin("formationScolaireView as formationView", "formationView.cfd", "indicateurRegionSortie.cfd")
    .$call((eb) => {
      if (filters.codeRegion) return eb.where("indicateurRegionSortie.codeRegion", "=", filters.codeRegion);
      return eb;
    })
    .$call((eb) => {
      if (filters.codeDepartement || filters.codeAcademie)
        return eb
          .innerJoin("departement", "departement.codeRegion", "indicateurRegionSortie.codeRegion")
          .$call((eb) => {
            if (filters.codeAcademie) return eb.where("departement.codeAcademie", "=", filters.codeAcademie);
            return eb;
          })
          .$call((eb) => {
            if (filters.codeDepartement) return eb.where("departement.codeDepartement", "=", filters.codeDepartement);
            return eb;
          });
      return eb;
    })
    .$call((eb) => {
      if (filters.codeNiveauDiplome) eb.where("formationView.codeNiveauDiplome", "in", filters.codeNiveauDiplome);
      return eb;
    })
    .where("indicateurRegionSortie.millesimeSortie", "=", getMillesimeFromCampagne(filters.campagne))
    .where(isScolaireIndicateurRegionSortie)
    .where(notAnneeCommuneIndicateurRegionSortie)
    .where(notHistoriqueIndicateurRegionSortie)
    .select([
      selectTauxInsertion6moisAgg("indicateurRegionSortie").as("tauxInsertion"),
      selectTauxPoursuiteAgg("indicateurRegionSortie").as("tauxPoursuite"),
    ])
    .executeTakeFirstOrThrow();
};
