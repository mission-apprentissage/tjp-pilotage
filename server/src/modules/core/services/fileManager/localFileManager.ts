import * as fs from "fs";
import path from "path";
import type { FileManager, FileType } from "shared/files/types";

import config from "@/config";

const mapperToFileType = (filepath: string, entry: fs.Dirent): FileType => {
  const fullPath = path.join(filepath, entry.name);
  const stats = fs.statSync(fullPath);
  const extension = path.extname(entry.name).replace(".", "");

  return {
    path: fullPath,
    name: entry.name,
    extension,
    type: "file",
    size: stats.size,
    lastModified: stats.mtime.toISOString(),
    isUploaded: true,
    nameWithoutExtension: path.basename(entry.name, `.${extension}`),
  };
};

export const localFileManagerFactory = (): FileManager => {
  return {
    uploadFile: async (filepath: string, file: Buffer) => {
      const folderPath = path.dirname(filepath);

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

          filesDetails.push(mapperToFileType(filepath, entry));
        }

        return filesDetails;
      } catch (error) {
        console.error(`Une erreur est survenue lors de la lecture des fichiers pour le chemin ${filepath}`, error);

        return [];
      }
    },
    deleteFile: async (filepath: string) => {
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    },
    getDownloadUrl: async (filepath: string): Promise<string> => {
      return encodeURI(`${config.publicUrl}/public/upload/${filepath.replace("./public/upload/", "")}`);
    },
  };
};

export const localFileManager = localFileManagerFactory();
