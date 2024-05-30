import { fileManager } from "../../../core/services/fileManager/fileManager";
import { filePathManager } from "../../../core/services/filePathManager/filePathManager";

const getIntentionFilesUseCaseFactory =
  (
    deps = {
      fileManager,
      filePathManager,
    }
  ) =>
  async (numero: string) =>
    deps.fileManager.listFiles(
      deps.filePathManager.getIntentionFilePath(numero)
    );

export const getIntentionFilesUseCase = getIntentionFilesUseCaseFactory();
