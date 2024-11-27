import { z } from "zod";

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

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface FileType extends z.infer<typeof fileTypeSchema> {}

export interface FileManager {
  deleteFile: (filepath: string) => Promise<void>;
  getDownloadUrl: (filepath: string) => Promise<string>;
  listFiles: (filepath: string) => Promise<FileType[]>;
  uploadFile: (filepath: string, file: Buffer) => Promise<void>;
}
