import { kdb } from "../../../../../db/db";

export const findFormations = async ({ offset = 0 }: { offset: number }) =>
  await kdb
    .selectFrom("formationScolaireView")
    .leftJoin("region", (join) =>
      join.on((eb) => eb(eb.val("true"), "=", eb.val("true")))
    )
    .select([
      "formationScolaireView.cfd",
      "formationScolaireView.codeNiveauDiplome",
      "formationScolaireView.typeFamille",
      "region.codeRegion",
    ])
    .offset(offset)
    .limit(50)
    .execute();
