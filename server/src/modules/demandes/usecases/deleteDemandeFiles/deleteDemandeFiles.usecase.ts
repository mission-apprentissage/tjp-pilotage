import type { FileType } from "shared/files/types";

import { fileManager } from "@/modules/core/services/fileManager/fileManager";
import { filePathManager } from "@/modules/core/services/filePathManager/filePathManager";

const deleteDemandeFilesFactory =
  (
    deps = {
      fileManager,
      filePathManager,
    }
  ) =>
    async ({ numero, files }: { numero: string; files: FileType[] }) => {
      for (const file of files) {
        const filepath = deps.filePathManager.getDemandeFilePath(numero, file.name);
        const legacyFilepath = deps.filePathManager.getLegacyIntentionFilePath(numero, file.name);

        console.log(`Suppression du fichier ${file.name} pour la demande ${numero} depuis ${filepath} et ${legacyFilepath}`);

        await deps.fileManager.deleteFile({filepath, legacyFilepath});
      }
    };

export const deleteDemandeFilesUseCase = deleteDemandeFilesFactory();
