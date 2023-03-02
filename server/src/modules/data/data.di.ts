import { rawDataRepository } from "./repositories/rawData.repository";
import { inserJeunesApi } from "./services/inserJeunesApi/inserJeunes.api";

export const dataDI = {
  rawDataRepository,
  inserJeunesApi,
};
