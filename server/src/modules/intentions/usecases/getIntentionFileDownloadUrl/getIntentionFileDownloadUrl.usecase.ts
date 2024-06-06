import { fileManager } from "../../../core/services/fileManager/fileManager";
import { filePathManager } from "../../../core/services/filePathManager/filePathManager";

const getIntentionFileDownloadUrlUseCaseFactory =
  (
    deps = {
      fileManager,
      filePathManager,
    }
  ) =>
  async (numero: string, filename: string) =>
    deps.fileManager.getDownloadUrl(
      deps.filePathManager.getIntentionFilePath(numero, filename)
    );

export const getIntentionFileDownloadUrlUseCase =
  getIntentionFileDownloadUrlUseCaseFactory();
