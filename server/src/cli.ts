import { program as cli } from "commander";
import { parse } from "csv-parse/sync";
import fs, { writeFileSync } from "fs";
import _ from "lodash";
import { PERMISSIONS, Role } from "shared";
import { z } from "zod";

import { basepath } from "./basepath";
import { migrateDownDB, migrateToLatest } from "./migrations/migrate";
import { createUser } from "./modules/core/usecases/createUser/createUser.usecase";
import { LineTypes } from "./modules/import/repositories/rawData.repository";
import { importConstatRentree } from "./modules/import/usecases/importConstatRentree/importConstatRentree.usecase";
import { importDataEtablissements } from "./modules/import/usecases/importDataEtablissements/importDataEtablissements.usecase";
import { importDataFormations } from "./modules/import/usecases/importDataFormations/importDataFormations.usecase";
import { importDiplomesProfessionnels } from "./modules/import/usecases/importDiplomesProfessionnels/importDiplomesProfessionnels.usecase";
import { importDiscipline } from "./modules/import/usecases/importDiscipline/importDiscipline.usecase";
import { importDispositifs } from "./modules/import/usecases/importDispositifs/importDispositifs.usecase";
import { importFamillesMetiers } from "./modules/import/usecases/importFamillesMetiers/importFamillesMetiers.usecase";
import { importFormations } from "./modules/import/usecases/importFormationEtablissement/importFormationEtablissements.usecase";
import { importIJData } from "./modules/import/usecases/importIJData/importIJData.usecase";
import { importIndicateursDepartement } from "./modules/import/usecases/importIndicateursDepartement/importIndicateursDepartement.usecase";
import { importIndicateursRegion } from "./modules/import/usecases/importIndicateursRegion/importIndicateursRegion.usecase";
import { importNiveauxDiplome } from "./modules/import/usecases/importNiveauxDiplome/importNiveauxDiplome.usecase";
import { importNSF } from "./modules/import/usecases/importNSF/importNSF.usecase";
import { importRawFile } from "./modules/import/usecases/importRawFile/importRawFile.usecase";
import { importLieuxGeographiques } from "./modules/import/usecases/importRegions/importLieuxGeographiques.usecase";
import { refreshViews } from "./modules/import/usecases/refreshViews/refreshViews.usecase";

cli.command("migrateDB").action(async () => {
  await migrateToLatest();
});

cli
  .command("migrateDownDB")
  .argument(
    "[numberOfMigrations]",
    "number of migrations to rollback [default: 1]"
  )
  .action(async (numberOfMigrations: number = 1) => {
    await migrateDownDB(numberOfMigrations);
  });

cli.command("create-migration").action(() =>
  writeFileSync(
    `${__dirname}/migrations/migration_${new Date().getTime()}.ts`,
    `import { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {};

export const down = async (db: Kysely<unknown>) => {};
    `
  )
);

cli
  .command("importUsers")
  .description("usage: cat << EOF | xargs -0 -I arg yarn cli importUsers arg")
  .description("csv: role;codeRegion;lastname;firstname;email")
  .argument("<json>")
  .option("--dryRun <boolean>", "parse the data only", false)
  .action(async (input: string, { dryRun }) => {
    const data = (
      parse(input, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        delimiter: ";",
      }) as {
        firstname: string;
        lastname: string;
        email: string;
        role: string;
        codeRegion?: string;
      }[]
    ).map((user) => _.mapValues(user, (value) => value || undefined));

    const users = z
      .array(
        z.object({
          firstname: z.string(),
          lastname: z.string(),
          email: z.string(),
          role: z.enum(Object.keys(PERMISSIONS) as [Role]),
          codeRegion: z
            .string()
            .optional()
            .transform((val) => val || undefined),
        })
      )
      .parse(data);

    if (dryRun) {
      console.log(users);
      return;
    }

    for (const user of users) {
      try {
        await createUser(user);
        console.log(`${user.email} created successfuly`);
      } catch (e) {
        console.log(`${user.email} failed`, (e as Error).message);
      }
    }
  });

cli
  .command("create-user")
  .requiredOption("--email <string>")
  .requiredOption("--firstname <string>")
  .requiredOption("--lastname <string>")
  .requiredOption("--role <string>")
  .option("--codeRegion <string>")
  .action(
    async (options: {
      email: string;
      firstname: string;
      lastname: string;
      role: Role;
      codeRegion?: string;
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
            ? `${basepath}/files/${year}/${type}_${year}.csv`
            : `${basepath}/files/${type}.csv`,
          "utf8"
        ),
      });

    const getImports = (type: keyof LineTypes, years?: string[]) => {
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
      ...getImports("regroupements"),
      ...getImports("attractivite_capacite", ["2021", "2022", "2023"]),
      ...getImports("BTS_attractivite_capacite", ["2022", "2023"]),
      ...getImports("constat", ["2020", "2021", "2022", "2023"]),
      ...getImports("nMef"),
      ...getImports("nNiveauFormationDiplome_"),
      ...getImports("nDispositifFormation_"),
      ...getImports("departements_academies_regions"),
      ...getImports("familleMetiers"),
      ...getImports("optionsBTS"),
      ...getImports("diplomesProfessionnels"),
      ...getImports("offres_apprentissage"),
      ...getImports("nFormationDiplome_"),
      ...getImports("vFormationDiplome_"),
      ...getImports("lyceesACCE"),
      ...getImports("chomage_regional_INSEE"),
      ...getImports("chomage_departemental_INSEE"),
      ...getImports("onisep_structures_denseignement_secondaire"),
      ...getImports("onisep_structures_denseignement_superieur"),
      ...getImports("n_categorie_specialite_"),
      ...getImports("n_domaine_specialite_"),
      ...getImports("n_groupe_specialite_"),
      ...getImports("n_matiere_"),
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
      importNSF,
      importDispositifs,
      importFamillesMetiers,
      importDataEtablissements,
      importDataFormations,
      importConstatRentree,
      importDiplomesProfessionnels,
      importIndicateursRegion,
      importIndicateursDepartement,
      importDiscipline,
      refreshViews,
    };

    if (usecaseName) {
      await usecases[usecaseName as keyof typeof usecases]();
    } else {
      for (const usecase of Object.values(usecases)) {
        await usecase();
      }
    }
  });

cli.command("importIJ").action(async () => {
  await importIJData();
});

cli
  .command("importFormations")
  .argument("[usecase]")
  .action(async (usecaseName: string) => {
    const usecases = {
      importFormations,
      refreshViews,
    };

    if (usecaseName) {
      await usecases[usecaseName as keyof typeof usecases]();
    } else {
      for (const usecase of Object.values(usecases)) {
        await usecase();
      }
    }
  });

cli.parse(process.argv);
