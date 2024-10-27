// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { inject } from "injecti";

import { fileManager } from "@/modules/core/services/fileManager/fileManager";
import { filePathManager } from "@/modules/core/services/filePathManager/filePathManager";

export const [uploadIntentionFilesUsecase] = inject(
  { fileManager, filePathManager },
  (deps) =>
    async ({ id, file, filename }: { id: string; file: Buffer; filename: string }) => {
      const filePath = deps.filePathManager.getIntentionFilePath(id, filename);

      console.log(`Upload du fichier ${filename} pour l'intention numéro: ${id} vers ${filePath}`);

      await deps.fileManager.uploadFile(filePath, file);
    }
);
