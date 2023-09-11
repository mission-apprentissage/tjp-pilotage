import { program as cli } from "commander";
import fs, { writeFileSync } from "fs";

import { basepath } from "./basepath";
import { migrateToLatest } from "./migrations/migrate";
import { createUser } from "./modules/core/usecases/createUser/createUser.usecase";
import { importDataEtablissements } from "./modules/data/usecases/importDataEtablissements/importDataEtablissements.usecase";
import { importDataFormations } from "./modules/data/usecases/importDataFormations/importDataFormations.usecase";
import { importDispositifs } from "./modules/data/usecases/importDispositifs/importDispositifs.usecase";
import { importFamillesMetiers } from "./modules/data/usecases/importFamillesMetiers/importFamillesMetiers.usecase";
import { importFormationEtablissements } from "./modules/data/usecases/importFormationEtablissement/importFormationEtablissements.usecase";
import { importIndicateursAcademie } from "./modules/data/usecases/importIndicateursAcademie/importIndicateursAcademie.usecase";
import { importIndicateursRegion } from "./modules/data/usecases/importIndicateursRegion/importIndicateursRegion.usecase";
import { importNiveauxDiplome } from "./modules/data/usecases/importNiveauxDiplome/importNiveauxDiplome.usecase";
import { importRawFile } from "./modules/data/usecases/importRawFile/importRawFile.usecase";
import { importLieuxGeographiques } from "./modules/data/usecases/importRegions/importLieuxGeographiques.usecase";

cli.command("migrateDB").action(async () => {
  await migrateToLatest();
});

cli.command("create-migration").action(() =>
  writeFileSync(
    `${__dirname}/migrations/migration_${new Date().getTime()}.ts`,
    `import { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {};
    
export const down = async () => {};
    `
  )
);

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
            ? `${basepath}/files/${year}/${type}.csv`
            : `${basepath}/files/${type}.csv`,
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
      importDataEtablissements,
      importDataFormations,
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
