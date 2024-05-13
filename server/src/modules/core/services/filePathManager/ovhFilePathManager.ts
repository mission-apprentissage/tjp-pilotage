import { FilePathManager } from "./filePathManager";

export const ovhFilePathManagerFactory = (): FilePathManager => {
  return {
    getIntentionFilePath: (id: string, filename: string = "") => {
      return `intentions/${id}/${filename}`;
    },
  };
};

export const ovhFilePathManager = ovhFilePathManagerFactory();
