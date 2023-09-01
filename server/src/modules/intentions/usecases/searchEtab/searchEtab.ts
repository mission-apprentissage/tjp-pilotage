import { inject } from "injecti";

import { findManyInLyceesACCE } from "./findManyInLyceesACCE.dep";
export const [searchEtab] = inject(
  { findManyInLyceesACCE },
  (deps) =>
    async ({ search }: { search: string }) => {
      const lyceeAcceLines = await deps.findManyInLyceesACCE({ search });
      const suggestions = lyceeAcceLines.map((item) => ({
        value: item.numero_uai,
        label: `${item.appellation_officielle} - ${item.commune_libe}`,
      }));
      return suggestions;
    }
);
