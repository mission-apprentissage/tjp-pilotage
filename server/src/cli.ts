import { program as cli } from "commander";
import fs from "fs";

import { migrateToLatest } from "./migrations/migrate";
import { createUser } from "./modules/core/usecases/createUser/createUser.usecase";
import { importDispositifs } from "./modules/data/usecases/importDispositifs/importDispositifs.usecase";
import { importFamillesMetiers } from "./modules/data/usecases/importFamillesMetiers/importFamillesMetiers.usecase";
import { importFormationEtablissements } from "./modules/data/usecases/importFormationEtablissement/importFormationEtablissements.usecase";
import { importNiveauxDiplome } from "./modules/data/usecases/importNiveauxDiplome/importNiveauxDiplome.usecase";
import { importRawFile } from "./modules/data/usecases/importRawFile/importRawFile.usecase";
import { importLieuxGeographiques } from "./modules/data/usecases/importRegions/importLieuxGeographiques.usecase";

cli.command("migrateDB").action(async () => {
  await migrateToLatest();
});

cli
  .command("create-user")
  .requiredOption("--email <string>")
  .requiredOption("--firstname <string>")
  .requiredOption("--lastname <string>")
  .requiredOption("--role <string>")
  .action(
    async (options: {
      email: string;
      firstname: string;
      lastname: string;
      role: string;
    }) => {
      await createUser(options);
    }
  );

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
    const actions = {
      regroupements: () => getImport("regroupements"),
      attractivite_capacite_2022: () =>
        getImport("attractivite_capacite", "2022"),
      "Cab-nbre_division_effectifs_par_etab_mefst11_2022": () =>
        getImport("Cab-nbre_division_effectifs_par_etab_mefst11", "2022"),
      attractivite_capacite_2021: () =>
        getImport("attractivite_capacite", "2021"),
      "Cab-nbre_division_effectifs_par_etab_mefst11_2021": () =>
        getImport("Cab-nbre_division_effectifs_par_etab_mefst11", "2021"),
      nMef: () => getImport("nMef"),
      nNiveauFormationDiplome_: () => getImport("nNiveauFormationDiplome_"),
      nDispositifFormation_: () => getImport("nDispositifFormation_"),
      familleMetiers: () => getImport("familleMetiers"),
      departements_academies_regions: () =>
        getImport("departements_academies_regions"),
      diplomesProfessionnels: () => getImport("diplomesProfessionnels"),
      nFormationDiplome_: () => getImport("nFormationDiplome_"),
      lyceesACCE: () => getImport("lyceesACCE"),
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
  .action(async (fetchIj: boolean | string) => {
    await importFormationEtablissements({ fetchIj: fetchIj !== "false" });
  });

cli.parse(process.argv);
