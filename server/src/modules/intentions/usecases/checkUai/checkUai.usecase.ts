import { inject } from "injecti";

import { findInLyccesACCE } from "./findInLyceesACCE.dep";
import { findManyInLyccesACCE } from "./findManyInLyceesACCE.dep";
export const [checkUai] = inject(
  { findInLyccesACCE, findManyInLyccesACCE },
  (deps) =>
    async ({ uai }: { uai: string }) => {
      if (uai.length !== 8) {
        const lyceeAcceLines = await deps.findManyInLyccesACCE({ uai });
        const suggestions = lyceeAcceLines.map((item) => ({
          uai: item.numero_uai,
          libelle: item.appellation_officielle,
          commune: item.commune_libe,
        }));
        return { status: "wrong_format" as const, suggestions };
      }

      const lyceeAcceLine = await deps.findInLyccesACCE({ uai });
      if (!lyceeAcceLine) return { status: "not_found" as const };

      return {
        status: "valid" as const,
        data: {
          uai,
          commune: lyceeAcceLine.commune_libe,
          codeRegion: "75",
          adresse: lyceeAcceLine.adresse_uai,
          libelle: lyceeAcceLine.appellation_officielle,
          codeDepartement: lyceeAcceLine.departement_insee_3,
          secteur: lyceeAcceLine.secteur_public_prive,
          codeAcademie: lyceeAcceLine.academie,
        },
      };
    }
);
