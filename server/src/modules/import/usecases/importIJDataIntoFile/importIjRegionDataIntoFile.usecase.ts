// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import fs from "fs";
import { MILLESIMES_IJ_REG } from "shared";

import { localFilePathManager } from "@/modules/core/services/filePathManager/localFilePathManager";
import { regionAcademiqueMapping } from "@/modules/import/domain/regionAcademiqueMapping";
import { getRegionData } from "@/modules/import/services/inserJeunesApi/inserJeunes.api";
import { inject } from "@/utils/inject";

import { appendIJRegionDataFile, createIJRegionDataFile, loadIdsFromFile } from "./utils";


export const [importIjRegionDataIntoFile] = inject(
  {
    getRegionData,
    createIJRegionDataFile,
    localFilePathManager,
    appendIJRegionDataFile,
  },
  (deps) => async () => {
    await deps.createIJRegionDataFile(deps.localFilePathManager.getIJRegionDataFilePath());

    let totalAppends = 0;
    let existingIds = new Set<string>();

    console.log("Chargement des IDs existants");
    existingIds = await loadIdsFromFile(deps.localFilePathManager.getIJRegionDataFilePath());
    console.log(`${existingIds.size} IDs chargés depuis le fichier existant`);

    console.log("Chargement du fichier");
    const file = fs.createWriteStream(deps.localFilePathManager.getIJRegionDataFilePath(), {flags: "a", encoding: "utf-8"});

    console.log("Récupération des données IJ pour les régions");

    for (const [codeRegionIj, codeRegion] of Object.entries(regionAcademiqueMapping)) {
      for (const millesime of MILLESIMES_IJ_REG) {
        try {
          const data = await deps.getRegionData({ codeRegionIj, millesime });

          const newRows = await deps.appendIJRegionDataFile({
            file,
            data,
            codeRegionIj,
            codeRegion,
            millesime,
            existingIds,
          });

          totalAppends += newRows;

          console.log(
            `Région : ${codeRegionIj} - Millésime : ${millesime}  ✅ + ${newRows} lignes`
          );
        } catch (_err) {
          console.log(`Région : ${codeRegionIj} - Millésime : ${millesime} ❌ Erreur: ${_err?.response?.data?.msg}`);
        }
      }
    }
    console.log(`${totalAppends} lignes ajoutées`);
  });
