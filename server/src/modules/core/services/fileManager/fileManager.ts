import { z } from "zod";

import { config } from "../../../../../config/config";
import { localFileManager } from "./localFileManager";
import { ovhFileManager } from "./ovhFileManager";

export interface FileManager {
  deleteFile: (filepath: string) => Promise<void>;
  getDownloadUrl: (filepath: string) => Promise<string>;
  listFiles: (filepath: string) => Promise<FileType[]>;
  uploadFile: (filepath: string, file: Buffer) => Promise<void>;
}

export const fileTypeSchema = z.object({
  path: z.string(),
  name: z.string(),
  nameWithoutExtension: z.string(),
  type: z.enum(["file", "directory"]),
  extension: z.string(),
  size: z.number(),
  lastModified: z.string(),
  isUploaded: z.boolean(),
});

export interface FileType extends z.infer<typeof fileTypeSchema> {}

export const fileManagerFactory = (): FileManager =>
  config.env === "dev" ? localFileManager : ovhFileManager;

export const fileManager: FileManager = fileManagerFactory();
