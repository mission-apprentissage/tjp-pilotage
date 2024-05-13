import * as fs from "fs";
import path from "path";
import { humanFileSize } from "shared/utils/humanFileSize";

import { localFilePathManager } from "../filePathManager/localFilePathManager";
import { FileManager, FileType } from "./fileManager";

export const localFileManagerFactory = (
  deps = {
    filePathManager: localFilePathManager,
    humanFileSizeTransformer: humanFileSize,
  }
): FileManager => {
  return {
    uploadFile: async (filepath: string, file: Buffer) => {
      const folderPath = path.basename(filepath);

      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      fs.writeFileSync(filepath, file, { encoding: "utf-8", flag: "w" });
    },
    listFiles: async (filepath: string): Promise<FileType[]> => {
      try {
        if (!fs.existsSync(filepath)) {
          return [];
        }

        const entries = fs.readdirSync(filepath, {
          withFileTypes: true,
        });
        const filesDetails: FileType[] = [];

        for (const entry of entries) {
          if (entry.isDirectory()) {
            continue;
          }

          const fullPath = path.join(filepath, entry.name);
          const stats = fs.statSync(fullPath);
          const extension = path.extname(entry.name);

          filesDetails.push({
            path: fullPath,
            name: path.basename(entry.name, extension),
            extension,
            type: "file",
            size: deps.humanFileSizeTransformer(stats.size),
            lastModified: stats.mtime.toISOString(),
          });
        }

        return filesDetails;
      } catch (error) {
        console.error(
          `Une erreur est survenue lors de la lecture des fichiers pour le chemin ${filepath}`,
          error
        );

        return [];
      }
    },
    deleteFile: async (filepath: string) => {
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    },
    getDownloadUrl: async (filepath: string): Promise<string | undefined> => {
      return filepath;
    },
  };
};

export const localFileManager = localFileManagerFactory();
