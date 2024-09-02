import { kdb } from "../../../../../db/db";

export const findCodesNiveauDiplome = async () =>
  await kdb
    .selectFrom("formationScolaireView")
    .distinct()
    .select(["codeNiveauDiplome"])
    .execute();
