import { config } from "../../../../../config/config";
import { localFilePathManager } from "./localFilePathManager";
import { ovhFilePathManager } from "./ovhFilePathManager";

export interface FilePathManager {
  getIntentionFilePath: (id: string, filename?: string) => string;
  getFranceTravailIndicateurTensionDepartementStatsFilePath: () => string;
  getFranceTravailIndicateurTensionRegionStatsFilePath: () => string;
}

export const filePathManagerFactory = (): FilePathManager =>
  config.env === "dev" ? localFilePathManager : ovhFilePathManager;

export const filePathManager: FilePathManager = filePathManagerFactory();
