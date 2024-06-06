import {
  fileManager,
  FileType,
} from "../../../core/services/fileManager/fileManager";
import { filePathManager } from "../../../core/services/filePathManager/filePathManager";

const deleteIntentionFilesFactory =
  (
    deps = {
      fileManager,
      filePathManager,
    }
  ) =>
  async ({ numero, files }: { numero: string; files: FileType[] }) => {
    for await (const file of files) {
      const filePath = deps.filePathManager.getIntentionFilePath(
        numero,
        file.name
      );

      console.log(
        `Suppression du fichier ${file.name} pour l'intention ${numero} depuis ${filePath}`
      );

      await deps.fileManager.deleteFile(filePath);
    }
  };

export const deleteIntentionFilesUseCase = deleteIntentionFilesFactory();
