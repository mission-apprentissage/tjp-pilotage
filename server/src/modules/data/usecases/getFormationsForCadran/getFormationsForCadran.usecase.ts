import { inject } from "injecti";

import { getFormationsQuery } from "./dependencies";

export const [getFormationsForCadran] = inject(
  { getFormationsQuery },
  (deps) =>
    async ({
      codeRegion,
      codeDiplome,
      effectifMin,
    }: {
      codeRegion: string[];
      codeDiplome?: string[];
      effectifMin?: number;
    }) => {
      const { count, formations } = await deps.getFormationsQuery({
        codeRegion,
        codeDiplome,
        effectifMin,
      });
      return { count, formations };
    }
);
