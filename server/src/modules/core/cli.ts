import { program as cli } from "commander";

import { importFamillesMetiers } from "../formations/imports/importFamillesMetiers/importFamillesMetiers.usecase";
import { importFormations } from "../formations/imports/importFormations/importFormations.usecase";

cli
  .command("importAll")
  .description("Import toutes les données")
  .action(async () => {
    console.log("début des imports");
    await importFamillesMetiers();
    await importFormations();
  });

cli
  .command("importFamilles")
  .description("Import les familles de métiers")
  .action(importFamillesMetiers);

cli
  .command("importFormations")
  .description("Import les formations")
  .action(importFormations);

cli.parse(process.argv);
