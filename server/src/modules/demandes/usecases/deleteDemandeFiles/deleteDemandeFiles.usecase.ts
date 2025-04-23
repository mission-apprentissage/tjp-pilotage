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
      // TODO
      for await (const file of files) {
        const filePath = deps.filePathManager.getDemandeFilePath(numero, file.name);

        console.log(`Suppression du fichier ${file.name} pour la demande ${numero} depuis ${filePath}`);

        await deps.fileManager.deleteFile(filePath);
      }
    };

export const deleteDemandeFilesUseCase = deleteDemandeFilesFactory();
