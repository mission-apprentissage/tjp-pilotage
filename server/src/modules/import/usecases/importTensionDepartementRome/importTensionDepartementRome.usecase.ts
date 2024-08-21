import { AxiosError } from "axios";
import { inject } from "injecti";

import { localFilePathManager } from "../../../core/services/filePathManager/localFilePathManager";
import { getStatsPerspectivesRecrutement } from "../../services/franceTravail/franceTravail.api";
import {
  appendFranceTravailTensionFile,
  createFranceTravailTensionFile,
  findAllDepartements,
  findAllRomeCodes,
} from "./importTensionDepartementRome.dep";

export const [importTensionDepartementRome] = inject(
  {
    findAllRomeCodes,
    findAllDepartements,
    createFranceTravailTensionFile,
    filePathManager: localFilePathManager,
    appendFranceTravailTensionFile,
  },
  (deps) => async () => {
    // Create new file
    deps.createFranceTravailTensionFile(
      deps.filePathManager.getFranceTravailIndicateurTensionStatsFilePath()
    );

    // Lister tous les ROMES pour lesquels il faut importer les données de tension
    const romes = await deps.findAllRomeCodes();

    console.log(`romes ? ${romes.length}`);

    // Lister tous les départements qu'il existe
    const departements = await deps.findAllDepartements();

    console.log(`departements ? ${departements.length}`);

    // Pour chaque ROME et chaque département, requêter les informations auprès de france travail

    let indexDepartement = 0,
      indexRome = 0;
    for (const departement of departements) {
      indexDepartement++;
      for (const rome of romes) {
        try {
          indexRome++;

          console.log(
            `Département (${indexDepartement}/${departements.length}) ${departement.codeDepartement} et rome (${indexRome}/${romes.length}) ${rome.codeRome}`
          );

          const result = await getStatsPerspectivesRecrutement(
            rome.codeRome,
            departement.codeDepartement
          );

          if (result?.length) {
            await deps.appendFranceTravailTensionFile(
              deps.filePathManager.getFranceTravailIndicateurTensionStatsFilePath(),
              result
            );
          }
        } catch (e) {
          if (e instanceof AxiosError) {
            console.error(
              `ERROR [DEP=${departement.codeDepartement},ROME=${rome.codeRome}] ${e.response?.data?.message}`
            );
          }
        }
      }
    }
  }
);
