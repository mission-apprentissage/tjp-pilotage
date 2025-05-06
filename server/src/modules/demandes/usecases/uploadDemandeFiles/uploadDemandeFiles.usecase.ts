// eslint-disable-next-line import/no-extraneous-dependencies, n/no-extraneous-import
import { fileManager } from "@/modules/core/services/fileManager/fileManager";
import { filePathManager } from "@/modules/core/services/filePathManager/filePathManager";
import { inject } from "@/utils/inject";

export const [uploadDemandeFilesUsecase] = inject(
  { fileManager, filePathManager },
  (deps) =>
    async ({ id, file, filename }: { id: string; file: Buffer; filename: string }) => {
      const filePath = deps.filePathManager.getDemandeFilePath(id, filename);

      console.log(`Upload du fichier ${filename} pour la demande numéro: ${id} vers ${filePath}`);

      await deps.fileManager.uploadFile(filePath, file);
    }
);
