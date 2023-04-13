import { dependencies } from "./dependencies";

const getFormationsFactory =
  ({
    findFormationsInDb = dependencies.findFormationsInDb,
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
    const formations = await findFormationsInDb({
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
    const filters = findFiltersInDb({
      codeRegion,
      codeAcademie,
      codeDepartement,
      codeDiplome,
      codeDispositif,
      commune,
      cfd,
      cfdFamille,
    });

    return {
      filters,
      ...formations,
    };
  };

export const getFormations = getFormationsFactory({});
