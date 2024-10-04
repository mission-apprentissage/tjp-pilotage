import { kdb } from "../../../../../db/db";

export const findFormations = async ({ offset = 0 }: { offset: number }) =>
  await kdb
    .selectFrom("formationScolaireView")
    .leftJoin(
      "formationEtablissement",
      "formationScolaireView.cfd",
      "formationEtablissement.cfd"
    )
    .leftJoin(
      "dataEtablissement",
      "dataEtablissement.uai",
      "formationEtablissement.uai"
    )
    .select([
      "formationScolaireView.cfd",
      "formationScolaireView.codeNiveauDiplome",
      "dataEtablissement.codeRegion",
      "formationEtablissement.id as formationEtablissement",
      "formationScolaireView.typeFamille",
    ])
    .offset(offset)
    .limit(50)
    .execute();
