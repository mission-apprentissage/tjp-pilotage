import { Academie } from "../../entities/Academie";
import { Departement } from "../../entities/Departement";
import { Region } from "../../entities/Region";
import { Departements_academies_regions } from "../../files/Departements_academies_regions";
import { streamIt } from "../../utils/streamIt";
import { importRegionsDeps } from "./importLieuxGeographiques.deps";

export const importLieuxGeographiquesFactory =
  ({
    createRegions = importRegionsDeps.createRegions,
    createAcademie = importRegionsDeps.createAcademie,
    createDepartement = importRegionsDeps.createDepartement,
    findDepartementAcademieRegions = importRegionsDeps.findDepartementAcademieRegions,
  }) =>
  async () => {
    console.log(`Import des regions`);

    await streamIt(
      (count) => findDepartementAcademieRegions({ offset: count, limit: 20 }),
      async (item) => {
        const region = createRegionFromLine(item);
        await createRegions([region]);

        const academie = createAcademieFromLine(item);
        if (!academie) return;
        await createAcademie(academie);

        const departement = createDepartementFromLine(item);
        if (!departement) return;
        await createDepartement(departement);
      }
    );

    console.log("Lieux géographiques ajoutés ou mis à jour");
  };

export const importLieuxGeographiques = importLieuxGeographiquesFactory({});

const createRegionFromLine = (data: Departements_academies_regions): Region => {
  return {
    codeRegion: data.codeRegion,
    libelleRegion: data.libelleRegion,
  };
};

const createAcademieFromLine = (
  data: Departements_academies_regions
): Academie | undefined => {
  if (data.codeAcademie.length !== 2) return;
  return {
    codeAcademie: data.codeAcademie,
    codeRegion: data.codeRegion,
    libelle: data.libelleAcademie,
  };
};

const createDepartementFromLine = (
  data: Departements_academies_regions
): Departement | undefined => {
  if (!data.codeDepartement || !data.libelleDepartement) return;
  return {
    codeRegion: data.codeRegion,
    codeAcademie: data.codeAcademie,
    libelle: data.libelleDepartement,
    codeDepartement: data.codeDepartement,
  };
};
