import { inject } from "injecti";

import { getformationsTransformationStatsQuery } from "./getFormationsStatsQuery.dep";

export const [getformationsTransformationStats] = inject(
  { getformationsTransformationStatsQuery },
  (deps) =>
    (filters: {
      status?: "draft" | "submitted";
      type: "fermeture" | "ouverture";
      rentreeScolaire?: number;
      codeRegion?: string;
      codeAcademie?: string;
      codeDepartement?: string;
      tauxPression?: "eleve" | "faible";
    }) => {
      return deps.getformationsTransformationStatsQuery(filters);
    }
);
