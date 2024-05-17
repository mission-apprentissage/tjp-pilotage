export interface FilePathManager {
  getIntentionFilePath: (id: string, filename?: string) => string;
}
