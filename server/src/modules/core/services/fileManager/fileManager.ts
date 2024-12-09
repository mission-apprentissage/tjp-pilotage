import type { FileManager } from "shared/files/types";

import config from "@/config";

import { localFileManager } from "./localFileManager";
import { ovhFileManager } from "./ovhFileManager";

export const fileManagerFactory = (): FileManager => (config.env === "local" ? localFileManager : ovhFileManager);

export const fileManager: FileManager = fileManagerFactory();
