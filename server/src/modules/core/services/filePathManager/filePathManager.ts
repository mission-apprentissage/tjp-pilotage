import config from "@/config";

import { localFilePathManager } from "./localFilePathManager";
import { ovhFilePathManager } from "./ovhFilePathManager";

export interface FilePathManager {
  getIntentionFilePath: (id: string, filename?: string) => string;
  getFranceTravailIndicateurTensionDepartementStatsFilePath: () => string;
  getFranceTravailIndicateurTensionRegionStatsFilePath: () => string;
  getFranceTravailIndicateurTensionStatsFilePath: () => string;
  getIJRegionDataFilePath: () => string;
  getIJUaiDataFilePath: () => string;
}

export const filePathManagerFactory = (): FilePathManager =>
  config.env === "local" ? localFilePathManager : ovhFilePathManager;

export const filePathManager: FilePathManager = filePathManagerFactory();
