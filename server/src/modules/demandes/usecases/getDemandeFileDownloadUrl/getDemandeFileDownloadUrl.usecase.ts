import { fileManager } from "@/modules/core/services/fileManager/fileManager";
import { filePathManager } from "@/modules/core/services/filePathManager/filePathManager";

const getDemandeFileDownloadUrlFactory =
  (
    deps = {
      fileManager,
      filePathManager,
    }
  ) =>
    async (numero: string, filename: string) =>
      deps.fileManager.getDownloadUrl({
        filepath: deps.filePathManager.getDemandeFilePath(numero, filename),
        legacyFilepath: deps.filePathManager.getLegacyIntentionFilePath(numero, filename),
      });

export const getDemandeFileDownloadUrlUsecase = getDemandeFileDownloadUrlFactory();
