import { rawDataRepository } from "./repositories/rawData.repository";
import { createEtablissements } from "./usecases/importEtablissements/createEtablissements";
import { createFamillesMetiers } from "./usecases/importFamillesMetiers/createFamilleMetier";
import { createFormation } from "./usecases/importFormations/createFormation";
import { createFormationsHistoriques } from "./usecases/importFormationsHistoriques/createFormationsHistoriques";
import { createRawDatas } from "./usecases/importRawFile/createRawDatas";
import { createRegions } from "./usecases/importRegions.ts/createRegions";
export const dataDI = {
  createEtablissements,
  rawDataRepository,
  createFamillesMetiers,
  createFormation,
  createRawDatas,
  createRegions,
  createFormationsHistoriques,
};
