import { program as cli } from "commander";
import fs from "fs";

import { kdb } from "../../db/db";
import { migrateToLatest } from "../../migrations/migrate";
import { inserJeunesApi } from "./services/inserJeunesApi/inserJeunes.api";
import { importDispositifs } from "./usecases/importDispositifs/importDispositifs.usecase";
import { importFamillesMetiers } from "./usecases/importFamillesMetiers/importFamillesMetiers.usecase";
import { importFormationEtablissements } from "./usecases/importFormationEtablissement/importFormationEtablissements.usecase";
import { importNiveauxDiplome } from "./usecases/importNiveauxDiplome/importNiveauxDiplome.usecase";
import { importRawFile } from "./usecases/importRawFile/importRawFile.usecase";
import { importLieuxGeographiques } from "./usecases/importRegions/importLieuxGeographiques.usecase";

cli.command("migrateDB").action(async () => {
  await migrateToLatest();
});

cli.command("truncateRawData").action(async () => {
  await kdb.deleteFrom("rawData").execute();
});

cli.command("importDepp").action(async () => {
  const uai = "0750783U";
  const millesime = "2020_2021";
  const data = await inserJeunesApi.getUaiData({ uai, millesime });

  fs.writeFileSync(
    `logs/${uai}_${millesime}.json`,
    JSON.stringify(data, undefined, " ")
  );
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
  .command("importFormations")
  .argument("[fetchIj]", "if true, refetch the ij data", true)
  .action(async (fetchIj: boolean) => {
    await importFormationEtablissements({ fetchIj });
  });

cli
  .command("import")
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

cli.parse(process.argv);
