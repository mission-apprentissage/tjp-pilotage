import { getFormationsRenoveesEnseignees } from "../../queries/getFormationsRenovees/getFormationsRenovees";
import { getStatsSortieParRegionsEtNiveauDiplome } from "../../queries/getStatsSortie/getStatsSortie";
import { getPositionQuadrant } from "../../services/getPositionQuadrant";
import { dependencies } from "./dependencies";

const getFormationEtablissementsFactory =
  (
    deps = {
      findFormationEtablissementsInDb:
        dependencies.findFormationEtablissementsInDb,
      findFiltersInDb: dependencies.findFiltersInDb,
      getFormationsRenoveesEnseignees,
      getStatsSortieParRegionsEtNiveauDiplome,
    }
  ) =>
  async (activeFilters: {
    offset?: number;
    limit?: number;
    codeRegion?: string[];
    codeAcademie?: string[];
    codeDepartement?: string[];
    codeDiplome?: string[];
    codeDispositif?: string[];
    commune?: string[];
    cfd?: string[];
    cfdFamille?: string[];
    uai?: string[];
    secteur?: string[];
    withAnneeCommune?: string;
    rentreeScolaire?: string[];
    orderBy?: { order: "asc" | "desc"; column: string };
  }) => {
    const [
      { etablissements, count },
      filters,
      statsSortie,
      formationsRenoveesEnseignees,
    ] = await Promise.all([
      deps.findFormationEtablissementsInDb(activeFilters),
      deps.findFiltersInDb(activeFilters),
      deps.getStatsSortieParRegionsEtNiveauDiplome(activeFilters),
      deps.getFormationsRenoveesEnseignees(activeFilters),
    ]);

    return {
      count,
      filters,
      etablissements: etablissements.map((etablissement) => ({
        ...etablissement,
        formationRenovee: formationsRenoveesEnseignees.includes(
          etablissement.formationRenovee ?? ""
        )
          ? etablissement.formationRenovee
          : undefined,
        positionQuadrant:
          statsSortie && statsSortie[etablissement.codeRegion ?? ""]
            ? getPositionQuadrant(
                etablissement,
                statsSortie[etablissement.codeRegion ?? ""][
                  etablissement.codeNiveauDiplome ?? ""
                ] || {}
              )
            : "Hors quadrant",
      })),
    };
  };

export const getFormationEtablissements = getFormationEtablissementsFactory();
