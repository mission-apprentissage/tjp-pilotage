import { FilePathManager } from "./filePathManager";

export const localFilePathManagerFactory = (): FilePathManager => {
  return {
    getIntentionFilePath: (id: string, filename: string = "") => {
      return `./public/upload/${id}/${filename}`;
    },
  };
};

export const localFilePathManager = localFilePathManagerFactory();
