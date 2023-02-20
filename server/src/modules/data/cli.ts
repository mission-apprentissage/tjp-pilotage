import { program as cli } from "commander";
import fs from "fs";

import { db, pool } from "../../db/zapatos";
import { importFormationEtablissements } from "./usecases/importEtablissements/importEtablissements.usecase";
import { importFamillesMetiers } from "./usecases/importFamillesMetiers/importFamillesMetiers.usecase";
import { importFormations } from "./usecases/importFormations/importFormations.usecase";
import { importFormationHistorique } from "./usecases/importFormationsHistoriques/importFormationsHistoriques.usecase";
import { importRawFile } from "./usecases/importRawFile/importRawFile.usecase";
import { importRegions } from "./usecases/importRegions.ts/importRegions.usecase";

cli
  .command("truncateRawData")
  .description("Clear")
  .action(async () => {
    await db.truncate(["rawData"], "CASCADE").run(pool);
  });

cli
  .command("importFiles")
  .description("Import csv files")
  .action(async () => {
    await importRawFile({
      type: "familleMetiers",
      key: "MEFSTAT11 TLEPRO",
      fileStream: fs.createReadStream(
        `${__dirname}/files/familleMetiers.csv`,
        "utf8"
      ),
    });
    await importRawFile({
      type: "regions",
      key: "codeRegion",
      fileStream: fs.createReadStream(`${__dirname}/files/regions.csv`, "utf8"),
    });

    await importRawFile({
      type: "diplomesProfessionnels",
      key: "Code diplôme",
      fileStream: fs.createReadStream(
        `${__dirname}/files/diplomesProfessionnels.csv`,
        "utf8"
      ),
    });

    await importRawFile({
      type: "nFormationDiplome_",
      key: "FORMATION_DIPLOME",
      fileStream: fs.createReadStream(
        `${__dirname}/files/nFormationDiplome_.csv`,
        "utf8"
      ),
    });

    await importRawFile({
      type: "affelnet2nde",
      key: "Etablissement",
      fileStream: fs.createReadStream(
        `${__dirname}/files/affelnet2nde.csv`,
        "utf8"
      ),
    });

    await importRawFile({
      type: "lyceesACCE",
      key: "numero_uai",
      fileStream: fs.createReadStream(
        `${__dirname}/files/lyceesACCE.csv`,
        "utf8"
      ),
    });
  });

cli
  .command("importAll")
  .description("Import toutes les données")
  .action(async () => {
    console.log("suppression des imports");
    await importRegions();
    await importFamillesMetiers();
    await importFormations();
    await importFormationHistorique();
    await importFormationEtablissements();
  });

cli
  .command("truncateImports")
  .description("Import les familles de métiers")
  .action(async () => {
    await db
      .truncate(
        [
          "region",
          "familleMetier",
          "formation",
          "formationHistorique",
          "etablissement",
        ],
        "CASCADE"
      )
      .run(pool);
  });

cli
  .command("importFamilles")
  .description("Import les familles de métiers")
  .action(importFamillesMetiers);

cli
  .command("importFormations")
  .description("Import les formations")
  .action(importFormations);

cli
  .command("importFormationHistorique")
  .description("Import les formations historiques")
  .action(importFormationHistorique);

cli
  .command("importRegions")
  .description("Import les regions")
  .action(importRegions);

cli
  .command("importFormationEtablissements")
  .description("Import les établissements")
  .action(importFormationEtablissements);

cli.parse(process.argv);
