import { dependencies } from "./dependencies";

const getFormationsFactory =
  ({
    findFormationsInDb = dependencies.findFormationsInDb,
    findFiltersInDb = dependencies.findFiltersInDb,
    findReferencesInDb = dependencies.findReferencesInDb,
  }) =>
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
    rentreeScolaire?: string[];
    cfdFamille?: string[];
    orderBy?: { order: "asc" | "desc"; column: string };
  }) => {
    const formationsPromise = findFormationsInDb(activeFilters);
    const filtersPromise = findFiltersInDb(activeFilters);

    const codeRegion = activeFilters.codeRegion;
    const { filters, references, count, formations } = {
      filters: await filtersPromise,
      ...(await formationsPromise),
      references:
        codeRegion && codeRegion.length === 1
          ? await findReferencesInDb({ codeRegion })
          : undefined,
    };

    const formationsWithDeltas = formations.map((formation) =>
      toFormationWithDelta({ formation, references })
    );

    return {
      count,
      filters,
      formations: formationsWithDeltas,
    };
  };

type FormationLine = Awaited<
  ReturnType<typeof dependencies.findFormationsInDb>
>["formations"][number];

type Deltas = Awaited<ReturnType<typeof dependencies.findReferencesInDb>>;

const toFormationWithDelta = ({
  formation,
  references,
}: {
  formation: FormationLine;
  references?: Deltas;
}) => {
  if (!references) return formation;
  const refPoursuiteEtudes = references.find(
    (item) => formation.codeNiveauDiplome === item.codeNiveauDiplome
  )?.tauxPoursuiteEtudes;

  const refInsertion12mois = references.find(
    (item) => formation.codeNiveauDiplome === item.codeNiveauDiplome
  )?.tauxInsertion12mois;

  const { tauxPoursuiteEtudes, tauxInsertion12mois } = formation;

  return {
    ...formation,
    deltaPoursuiteEtudes:
      refPoursuiteEtudes && tauxPoursuiteEtudes
        ? tauxPoursuiteEtudes - refPoursuiteEtudes
        : undefined,
    deltaInsertion12mois:
      refInsertion12mois && tauxInsertion12mois
        ? tauxInsertion12mois - refInsertion12mois
        : undefined,
  };
};

export const getFormations = getFormationsFactory({});
