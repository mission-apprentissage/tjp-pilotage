import { dependencies } from "./dependencies";

const getFormationsFactory =
  ({
    findFormationsInDb = dependencies.findFormationsInDb,
    findFiltersInDb = dependencies.findFiltersInDb,
    findReferencesInDb = dependencies.findReferencesInDb,
  }) =>
  async ({
    offset,
    limit,
    orderBy,
    codeRegion,
    codeAcademie,
    codeDepartement,
    codeDiplome,
    codeDispositif,
    commune,
    cfd,
    cfdFamille,
  }: {
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
    orderBy?: { order: "asc" | "desc"; column: string };
  }) => {
    const formationsPromise = findFormationsInDb({
      offset,
      limit,
      codeRegion,
      codeAcademie,
      codeDepartement,
      codeDiplome,
      codeDispositif,
      commune,
      cfd,
      cfdFamille,
      orderBy,
    });
    const filtersPromise = findFiltersInDb({
      codeRegion,
      codeAcademie,
      codeDepartement,
      codeDiplome,
      codeDispositif,
      commune,
      cfd,
      cfdFamille,
    });

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

  const refInsertion6mois = references.find(
    (item) => formation.codeNiveauDiplome === item.codeNiveauDiplome
  )?.tauxInsertion;

  const { tauxPoursuiteEtudes, tauxInsertion6mois } = formation;

  return {
    ...formation,
    deltaPoursuiteEtudes:
      refPoursuiteEtudes && tauxPoursuiteEtudes
        ? tauxPoursuiteEtudes - refPoursuiteEtudes
        : undefined,
    deltaInsertion6mois:
      refInsertion6mois && tauxInsertion6mois
        ? tauxInsertion6mois - refInsertion6mois
        : undefined,
  };
};

export const getFormations = getFormationsFactory({});
