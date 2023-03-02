import { program as cli } from "commander";
import fs from "fs";

import { db, pool } from "../../db/zapatos";
import { inserJeunesApi } from "./services/inserJeunesApi/inserJeunes.api";
import { importFamillesMetiers } from "./usecases/importFamillesMetiers/importFamillesMetiers.usecase";
import { importFormationEtablissements } from "./usecases/importFormationEtablissement/importFormationEtablissements.usecase";
import { importFormations } from "./usecases/importFormations/importFormations.usecase";
import { importFormationHistorique } from "./usecases/importFormationsHistoriques/importFormationsHistoriques.usecase";
import { importRawFile } from "./usecases/importRawFile/importRawFile.usecase";
import { importRegions } from "./usecases/importRegions/importRegion.usecase";

cli.command("truncateRawData").action(async () => {
  await db.truncate(["rawData"], "CASCADE").run(pool);
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
  .argument("[filename]>")
  .action(async (filename: string) => {
    const actions = {
      nMef: () =>
        importRawFile({
          type: "nMef",
          key: "FORMATION_DIPLOME",
          fileStream: fs.createReadStream(
            `${__dirname}/files/nMef.csv`,
            "utf8"
          ),
        }),
      familleMetiers: () =>
        importRawFile({
          type: "familleMetiers",
          key: "MEFSTAT11 TLEPRO",
          fileStream: fs.createReadStream(
            `${__dirname}/files/familleMetiers.csv`,
            "utf8"
          ),
        }),
      "Cab-nbre_division_effectifs_par_etab_mefst11": () =>
        importRawFile({
          type: "Cab-nbre_division_effectifs_par_etab_mefst11",
          key: "Numéro d'établissement",
          fileStream: fs.createReadStream(
            `${__dirname}/files/Cab-nbre_division_effectifs_par_etab_mefst11.csv`,
            "utf8"
          ),
        }),
      regions: () =>
        importRawFile({
          type: "regions",
          key: "codeRegion",
          fileStream: fs.createReadStream(
            `${__dirname}/files/regions.csv`,
            "utf8"
          ),
        }),
      diplomesProfessionnels: () =>
        importRawFile({
          type: "diplomesProfessionnels",
          key: "Code diplôme",
          fileStream: fs.createReadStream(
            `${__dirname}/files/diplomesProfessionnels.csv`,
            "utf8"
          ),
        }),
      nFormationDiplome_: () =>
        importRawFile({
          type: "nFormationDiplome_",
          key: "FORMATION_DIPLOME",
          fileStream: fs.createReadStream(
            `${__dirname}/files/nFormationDiplome_.csv`,
            "utf8"
          ),
        }),
      affelnet2nde: () =>
        importRawFile({
          type: "affelnet2nde",
          key: "Etablissement",
          fileStream: fs.createReadStream(
            `${__dirname}/files/affelnet2nde.csv`,
            "utf8"
          ),
        }),
      lyceesACCE: () =>
        importRawFile({
          type: "lyceesACCE",
          key: "numero_uai",
          fileStream: fs.createReadStream(
            `${__dirname}/files/lyceesACCE.csv`,
            "utf8"
          ),
        }),
    };

    if (filename) {
      await actions[filename as keyof typeof actions]();
    } else {
      for (const action of Object.values(actions)) {
        await action();
      }
    }
  });

cli.command("truncateImports").action(async () => {
  await db
    .truncate(
      [
        "region",
        "familleMetier",
        "formation",
        "formationHistorique",
        "etablissement",
        "formationEtablissement",
      ],
      "CASCADE"
    )
    .run(pool);
});

cli
  .command("import")
  .argument("[usecase]")
  .action(async (usecaseName: string) => {
    const usecases = {
      importRegions,
      importFamillesMetiers,
      importFormations,
      importFormationHistorique,
      importFormationEtablissements,
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
