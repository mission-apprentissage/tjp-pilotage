import "dotenv/config";

import { program as cli } from "commander";

import { importFamillesMetiers } from "../formations/imports/importFamillesMetiers/importFamillesMetiers.usecase";

cli
  .command("importFamilles")
  .description("Import les familles de métiers")
  .action(() => importFamillesMetiers());

cli.parse(process.argv);
