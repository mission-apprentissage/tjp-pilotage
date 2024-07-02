import { cleanNull } from "../../../../../utils/noNull";
import { Filters } from "../getDataForPanoramaDepartement.schema";
import { getFormationsDepartementBase } from "./getFormationsDepartementBase.dep";

export const getTopFlopFormationsDepartement = async (filters: Filters) =>
  getFormationsDepartementBase(filters).execute().then(cleanNull);
