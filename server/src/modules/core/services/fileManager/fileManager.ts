import type { FileManager } from "shared/files/types";

import config from "@/config";

import { localFileManager } from "./localFileManager";
import { ovhFileManager } from "./ovhFileManager";

export const fileManagerFactory = (): FileManager => (config.env === "recette1" ? localFileManager : ovhFileManager);

export const fileManager: FileManager = fileManagerFactory();
