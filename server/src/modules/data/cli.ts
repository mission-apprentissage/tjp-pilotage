import { program as cli } from "commander";
import fs from "fs";

import { migrateToLatest } from "../../migrations/migrate";
import { importDispositifs } from "./usecases/importDispositifs/importDispositifs.usecase";
import { importFamillesMetiers } from "./usecases/importFamillesMetiers/importFamillesMetiers.usecase";
import { importFormationEtablissements } from "./usecases/importFormationEtablissement/importFormationEtablissements.usecase";
import { importIndicateursAcademie } from "./usecases/importIndicateursAcademie/importIndicateursAcademie.usecase";
import { importIndicateursRegion } from "./usecases/importIndicateursRegion/importIndicateursRegion.usecase";
import { importNiveauxDiplome } from "./usecases/importNiveauxDiplome/importNiveauxDiplome.usecase";
import { importRawFile } from "./usecases/importRawFile/importRawFile.usecase";
import { importLieuxGeographiques } from "./usecases/importRegions/importLieuxGeographiques.usecase";

cli.command("migrateDB").action(async () => {
  await migrateToLatest();
});

cli
  .command("importFiles")
  .argument("[filename]")
  .action(async (filename: string) => {
    const getImport = (type: string, year?: string) =>
      importRawFile({
        type: year ? `${type}_${year}` : type,
        fileStream: fs.createReadStream(
          year
            ? `${__dirname}/files/${year}/${type}.csv`
            : `${__dirname}/files/${type}.csv`,
          "utf8"
        ),
      });

    const getImports = (type: string, years?: string[]) => {
      if (!years) {
        return { [type]: () => getImport(type) };
      }
      return years.reduce(
        (acc, year) => ({
          ...acc,
          [`${type}_${year}`]: () => getImport(type, year),
        }),
        {} as Record<string, () => Promise<void>>
      );
    };

    const actions = {
      regroupements: () => getImport("regroupements"),
      ...getImports("attractivite_capacite", ["2021", "2022"]),
      ...getImports("decrochage_regional", ["2020"]),
      ...getImports("decrochage_academique", ["2020"]),
      ...getImports("Cab-nbre_division_effectifs_par_etab_mefst11", [
        "2020",
        "2021",
        "2022",
      ]),
      ...getImports("nMef"),
      ...getImports("nNiveauFormationDiplome_"),
      ...getImports("nDispositifFormation_"),
      ...getImports("departements_academies_regions"),
      ...getImports("familleMetiers"),
      ...getImports("diplomesProfessionnels"),
      ...getImports("nFormationDiplome_"),
      ...getImports("lyceesACCE"),
    };

    if (filename) {
      await actions[filename as keyof typeof actions]();
    } else {
      for (const action of Object.values(actions)) {
        await action();
      }
    }
  });

cli
  .command("importTables")
  .argument("[usecase]")
  .action(async (usecaseName: string) => {
    const usecases = {
      importLieuxGeographiques,
      importNiveauxDiplome,
      importDispositifs,
      importFamillesMetiers,
    };

    if (usecaseName) {
      await usecases[usecaseName as keyof typeof usecases]();
    } else {
      for (const usecase of Object.values(usecases)) {
        await usecase();
      }
    }
  });

cli
  .command("importFormations")
  .argument("[fetchIj]", "if true, refetch the ij data", true)
  .action(async (fetchIjOption: boolean | string) => {
    const fetchIj = fetchIjOption !== "false";
    await importIndicateursAcademie();
    await importIndicateursRegion();
    await importFormationEtablissements({ fetchIj });
  });

cli.parse(process.argv);
