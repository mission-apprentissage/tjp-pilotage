export interface FileManager {
  deleteFile: (filepath: string) => Promise<void>;
  getDownloadUrl: (filepath: string) => Promise<string | undefined>;
  listFiles: (filepath: string) => Promise<FileType[]>;
  uploadFile: (filepath: string, file: Buffer) => Promise<void>;
}

export interface FileType {
  path: string;
  name: string;
  type: "file" | "directory";
  extension: string;
  size: string;
  lastModified: string;
}
