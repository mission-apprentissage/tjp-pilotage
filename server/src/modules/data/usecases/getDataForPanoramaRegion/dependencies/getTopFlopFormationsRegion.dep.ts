import { cleanNull } from "../../../../../utils/noNull";
import { Filters } from "../getDataForPanoramaRegion.schema";
import { getFormationsRegionBase } from "./getFormationsRegionBase.dep";

export const getTopFlopFormationsRegion = async (filters: Filters) =>
  getFormationsRegionBase(filters).execute().then(cleanNull);
