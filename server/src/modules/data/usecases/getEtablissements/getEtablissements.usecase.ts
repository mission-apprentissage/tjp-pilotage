import { dependencies } from "./dependencies";

const getEtablissementsFactory =
  ({
    findEtablissementsInDb = dependencies.findEtablissementsInDb,
    findFiltersInDb = dependencies.findFiltersInDb,
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
    uai,
    secteur,
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
    uai?: string[];
    secteur?: string[];
    orderBy?: { order: "asc" | "desc"; column: string };
  }) => {
    console.log(orderBy);
    const etablissementsPromise = findEtablissementsInDb({
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
      uai,
      orderBy,
      secteur,
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

    const { filters, count, etablissements } = {
      filters: await filtersPromise,
      ...(await etablissementsPromise),
    };

    return {
      count,
      filters,
      etablissements,
    };
  };

export const getEtablissements = getEtablissementsFactory({});
