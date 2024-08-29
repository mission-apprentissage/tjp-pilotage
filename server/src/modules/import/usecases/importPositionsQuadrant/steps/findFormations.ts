import { kdb } from "../../../../../db/db";

export const findFormations = async ({ offset = 0 }: { offset: number }) =>
  await kdb
    .selectFrom("formationScolaireView")
    .select(["formationScolaireView.cfd"])
    .leftJoin(
      "formationEtablissement",
      "formationScolaireView.cfd",
      "formationEtablissement.cfd"
    )
    .leftJoin(
      "dataEtablissement",
      "dataEtablissement.uai",
      "formationEtablissement.UAI"
    )
    .offset(offset)
    .limit(50)
    .execute();
