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
      deps.fileManager.getDownloadUrl(deps.filePathManager.getDemandeFilePath(numero, filename));

export const getDemandeFileDownloadUrlUsecase = getDemandeFileDownloadUrlFactory();
