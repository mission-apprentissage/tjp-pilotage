import type { Command } from "commander";
import { parse } from "csv-parse/sync";
import { mapValues } from "lodash-es";
import path from "path";
import type { Role } from "shared";
import { PERMISSIONS } from "shared";
import { z } from "zod";

import { basepath } from "./basepath";
import { createUser } from "./modules/core/usecases/createUser/createUser.usecase";
import type { LineTypes } from "./modules/import/repositories/rawData.repository";
import { Schemas } from "./modules/import/repositories/rawData.repository";
import { importActionPrioritaire } from "./modules/import/usecases/importActionPrioritaire/importActionPrioritaire.usecase";
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
import { importLienEmploiFormation } from "./modules/import/usecases/importLienEmploiFormation/importLienEmploiFormation.usecase";
import { importNiveauxDiplome } from "./modules/import/usecases/importNiveauxDiplome/importNiveauxDiplome.usecase";
import { importNSF } from "./modules/import/usecases/importNSF/importNSF.usecase";
import { importPositionsQuadrant } from "./modules/import/usecases/importPositionsQuadrant/importPositionsQuadrant";
import type { ImportFileError } from "./modules/import/usecases/importRawFile/importRawFile.usecase";
import { importRawFile } from "./modules/import/usecases/importRawFile/importRawFile.usecase";
import { importLieuxGeographiques } from "./modules/import/usecases/importRegions/importLieuxGeographiques.usecase";
import { importTensionFranceTravailDepartement } from "./modules/import/usecases/importTensionFranceTravail/importTensionFranceTravailDepartement.usecase";
import { importTensionFranceTravailNational } from "./modules/import/usecases/importTensionFranceTravail/importTensionFranceTravailNational.usecase";
import { importTensionFranceTravailRegion } from "./modules/import/usecases/importTensionFranceTravail/importTensionFranceTravailRegion.usecase";
import { importTensionRomeDepartement } from "./modules/import/usecases/importTensionRome/importTensionRomeDepartement.usecase";
import { importTensionRomeNational } from "./modules/import/usecases/importTensionRome/importTensionRomeNational.usecase";
import { importTensionRomeRegion } from "./modules/import/usecases/importTensionRome/importTensionRomeRegion.usecase";
import { refreshViews } from "./modules/import/usecases/refreshViews/refreshViews.usecase";
import { writeErrorLogs } from "./modules/import/utils/writeErrorLogs";
import { __dirname } from "./utils/esmUtils";

export function productCommands(cli: Command) {
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
      ).map((user) => mapValues(user, (value) => value || undefined));

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
          await createUser({
            body: user,
          });
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
      async (options: { email: string; firstname: string; lastname: string; role: Role; codeRegion?: string }) => {
        await createUser({ body: options });
      }
    );

  cli
    .command("importFiles")
    .argument("[filename]")
    .action(async (filename?: string) => {
      const getImport = async ({
        type,
        year,
        schema,
      }: {
        type: string;
        year?: string;
        schema: Zod.Schema<unknown>;
      }) => {
        const filePath = year ? `${basepath}/files/${year}/${type}_${year}.csv` : `${basepath}/files/${type}.csv`;
        return await importRawFile({
          type: year ? `${type}_${year}` : type,
          path: filePath,
          schema,
        });
      };

      const getImports = ({
        type,
        years,
        schema,
      }: {
        type: keyof LineTypes;
        years?: string[];
        schema: Zod.Schema<unknown>;
      }) => {
        if (!years) {
          return { [type]: async () => getImport({ type, schema }) };
        }
        return years.reduce(
          (acc, year) => ({
            ...acc,
            [`${type}_${year}`]: async () => getImport({ type, year, schema }),
          }),
          {} as Record<string, () => Promise<Array<ImportFileError>>>
        );
      };

      const actions = {
        ...getImports({ type: "regroupements", schema: Schemas.regroupements }),
        ...getImports({
          type: "attractivite_capacite",
          years: ["2021", "2022", "2023"],
          schema: Schemas.attractivite_capacite,
        }),
        ...getImports({
          type: "BTS_attractivite_capacite",
          years: ["2022", "2023"],
          schema: Schemas.BTS_attractivite_capacite,
        }),
        ...getImports({
          type: "constat",
          years: ["2020", "2021", "2022", "2023"],
          schema: Schemas.constat,
        }),
        ...getImports({ type: "nMef", schema: Schemas.nMef }),
        ...getImports({
          type: "nNiveauFormationDiplome_",
          schema: Schemas.nNiveauFormationDiplome_,
        }),
        ...getImports({
          type: "nDispositifFormation_",
          schema: Schemas.nDispositifFormation_,
        }),
        ...getImports({
          type: "departements_academies_regions",
          schema: Schemas.departements_academies_regions,
        }),
        ...getImports({ type: "familleMetiers", schema: Schemas.familleMetiers }),
        ...getImports({ type: "optionsBTS", schema: Schemas.optionsBTS }),
        ...getImports({
          type: "diplomesProfessionnels",
          schema: Schemas.diplomesProfessionnels,
        }),
        ...getImports({
          type: "offres_apprentissage",
          schema: Schemas.offresApprentissage,
        }),
        ...getImports({
          type: "nFormationDiplome_",
          schema: Schemas.nFormationDiplome,
        }),
        ...getImports({
          type: "vFormationDiplome_",
          schema: Schemas.vFormationDiplome,
        }),
        ...getImports({ type: "lyceesACCE", schema: Schemas.lyceesACCE }),
        ...getImports({
          type: "chomage_regional_INSEE",
          schema: Schemas.chomage_regional_INSEE,
        }),
        ...getImports({
          type: "chomage_departemental_INSEE",
          schema: Schemas.chomage_departemental_INSEE,
        }),
        ...getImports({
          type: "onisep_structures_denseignement_secondaire",
          schema: Schemas.onisep_structures_denseignement_secondaire,
        }),
        ...getImports({
          type: "onisep_structures_denseignement_superieur",
          schema: Schemas.onisep_structures_denseignement_superieur,
        }),
        ...getImports({
          type: "n_categorie_specialite_",
          schema: Schemas.n_categorie_specialite_,
        }),
        ...getImports({
          type: "n_domaine_specialite_",
          schema: Schemas.n_domaine_specialite_,
        }),
        ...getImports({
          type: "n_groupe_specialite_",
          schema: Schemas.n_groupe_specialite_,
        }),
        ...getImports({
          type: "domaine_professionnel",
          schema: Schemas.domaine_professionnel,
        }),
        ...getImports({ type: "rome", schema: Schemas.rome }),
        ...getImports({ type: "metier", schema: Schemas.metier }),
        ...getImports({ type: "certif_info", schema: Schemas.certif_info }),
        ...getImports({ type: "discipline", schema: Schemas.discipline }),
        ...getImports({
          type: "tension_rome",
          schema: Schemas.tension_rome,
        }),
        ...getImports({
          type: "tension_rome_region",
          schema: Schemas.tension_rome_region,
        }),
        ...getImports({
          type: "tension_rome_departement",
          schema: Schemas.tension_rome_departement,
        }),
        ...getImports({
          type: "actions_prioritaires",
          schema: Schemas.actions_prioritaires,
        }),
      };

      await writeErrorLogs({
        path: path.join(__dirname(), "import_files_report.csv"),
        withHeader: true,
      });

      if (filename) {
        const actionErrors = await actions[filename as keyof typeof actions]();
        if (actionErrors.length > 0) {
          await writeErrorLogs({
            path: path.join(__dirname(), "import_files_report.csv"),
            errors: actionErrors,
            withHeader: false,
          });
        }
      } else {
        for (const action of Object.values(actions)) {
          const actionErrors = await action();

          if (actionErrors.length > 0) {
            await writeErrorLogs({
              path: path.join(__dirname(), "import_files_report.csv"),
              errors: actionErrors,
              withHeader: false,
            });
          }
        }
      }
    });

  cli
    .command("importTensionFranceTravail")
    .description("Import des données de tension (national/régional/départemental) depuis France Travail")
    .argument("[usecase]")
    .action(async (usecaseName: string) => {
      const usecases = {
        importTensionFranceTravailNational,
        importTensionFranceTravailRegion,
        importTensionFranceTravailDepartement,
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
        importLienEmploiFormation,
        importDiscipline,
        importTensionRomeNational,
        importTensionRomeRegion,
        importTensionRomeDepartement,
        importActionPrioritaire,
      };

      if (usecaseName) {
        await usecases[usecaseName as keyof typeof usecases]();
      } else {
        for (const usecase of Object.values(usecases)) {
          await usecase();
        }
      }
      await refreshViews();
    });

  cli.command("importIJ").action(async () => {
    await importIJData();
  });

  cli
    .command("importPositionsQuadrant")
    .description("Calcul des positions quadrants")
    .action(async () => {
      await importPositionsQuadrant();
    });

  cli
    .command("importFormations")
    .argument("[usecase]")
    .action(async (usecaseName: string) => {
      const usecases = {
        importFormations,
        importPositionsQuadrant,
      };

      if (usecaseName) {
        await usecases[usecaseName as keyof typeof usecases]();
      } else {
        for (const usecase of Object.values(usecases)) {
          await usecase();
        }
      }
      await refreshViews();
    });

  cli.command("refreshViews").action(async () => {
    await refreshViews();
  });
}
