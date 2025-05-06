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
      deps.fileManager.listFiles(deps.filePathManager.getDemandeFilePath(numero));

export const getDemandeFilesUsecase = getDemandeFilesFactory();
