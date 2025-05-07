import { fileManager } from "@/modules/core/services/fileManager/fileManager";
import { filePathManager } from "@/modules/core/services/filePathManager/filePathManager";

const getDemandeFilesFactory =
  (
    deps = {
      fileManager,
      filePathManager,
    }
  ) =>
    async (numero: string) =>
      deps.fileManager.listFiles({
        filepath: deps.filePathManager.getDemandeFilePath(numero),
        legacyFilepath: deps.filePathManager.getLegacyIntentionFilePath(numero)
      });

export const getDemandeFilesUsecase = getDemandeFilesFactory();
