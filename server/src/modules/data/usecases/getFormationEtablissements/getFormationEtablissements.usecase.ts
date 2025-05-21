import type { MILLESIMES_IJ } from "shared";
import type { getFormationEtablissementsSchema } from "shared/routes/schemas/get.etablissements.schema";
import type { z } from "zod";

import { getFormationsRenoveesEnseigneesQuery } from "@/modules/data/queries/getFormationsRenovees/getFormationsRenovees";
import { getStatsSortieParRegionsEtNiveauDiplomeQuery } from "@/modules/data/queries/getStatsSortie/getStatsSortie";
import { getTauxDevenirFavorable } from "@/modules/utils/calculTaux/tauxDevenirFavorable";
import { getTauxInsertion } from "@/modules/utils/calculTaux/tauxInsertion";
import { getTauxPoursuite } from "@/modules/utils/calculTaux/tauxPoursuite";

import { getFiltersQuery } from "./deps/getFiltersQuery.dep";
import { getFormationEtablissementsQuery } from "./deps/getFormationEtablissementsQuery.dep";

export interface Filters extends z.infer<typeof getFormationEtablissementsSchema.querystring> {
  millesimeSortie: (typeof MILLESIMES_IJ)[number];
}

const getFormationEtablissementsFactory =
  (
    deps = {
      getFormationEtablissementsQuery,
      getFiltersQuery,
      getFormationsRenoveesEnseigneesQuery,
      getStatsSortieParRegionsEtNiveauDiplomeQuery,
    }
  ) =>
    async (activeFilters: Partial<Filters>) => {
      const [{ etablissements, count }, filters, formationsRenoveesEnseignees] = await Promise.all([
        deps.getFormationEtablissementsQuery(activeFilters),
        deps.getFiltersQuery(activeFilters),
        deps.getFormationsRenoveesEnseigneesQuery(activeFilters),
      ]);

      return {
        count,
        filters,
        etablissements: etablissements.map((etablissement) => ({
          ...etablissement,
          tauxInsertionEtablissement: getTauxInsertion({
            nbInsertion6mois: etablissement.nbInsertion6moisEtablissement,
            nbSortants: etablissement.nbSortantsEtablissement,
          }),
          tauxPoursuiteEtablissement: getTauxPoursuite({
            nbPoursuite: etablissement.nbPoursuiteEtablissement,
            effectifSortie: etablissement.effectifSortieEtablissement,
          }),
          tauxDevenirFavorableEtablissement: getTauxDevenirFavorable({
            nbPoursuite: etablissement.nbPoursuiteEtablissement,
            nbInsertion6mois: etablissement.nbInsertion6moisEtablissement,
            effectifSortie: etablissement.effectifSortieEtablissement,
          }),
          tauxInsertion: getTauxInsertion({
            nbInsertion6mois: etablissement.nbInsertion6moisRegion,
            nbSortants: etablissement.nbSortantsRegion,
          }),
          tauxPoursuite: getTauxPoursuite({
            nbPoursuite: etablissement.nbPoursuiteRegion,
            effectifSortie: etablissement.effectifSortieRegion,
          }),
          tauxDevenirFavorable: getTauxDevenirFavorable({
            nbPoursuite: etablissement.nbPoursuiteRegion,
            nbInsertion6mois: etablissement.nbInsertion6moisRegion,
            effectifSortie: etablissement.effectifSortieRegion,
          }),
          formationRenovee: formationsRenoveesEnseignees.includes(etablissement.formationRenovee ?? "")
            ? etablissement.formationRenovee
            : undefined,
        })),
      };
    };

export const getFormationEtablissements = getFormationEtablissementsFactory();
